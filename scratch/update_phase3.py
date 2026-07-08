import re
import sys

file_path = r"C:\Users\Suswati\Documents\Nexa-inv\backend\app\Modules\Core\Presentation\Controllers\Phase3Controller.php"

with open(file_path, "r") as f:
    content = f.read()

# 1. Add AuditLog import
if "use App\\Modules\\Core\\Domain\\Models\\AuditLog;" not in content:
    content = content.replace("use Illuminate\\Support\\Facades\\DB;", "use Illuminate\\Support\\Facades\\DB;\nuse App\\Modules\\Core\\Domain\\Models\\AuditLog;")

# 2. Add log method
log_method = """
    private function log(Request $request, string $event, string $type, int $modelId, array $old = [], array $new = []): void
    {
        AuditLog::create([
            'user_id'        => $request->user()?->id ?? auth()->id(),
            'event'          => $event,
            'auditable_type' => $type,
            'auditable_id'   => $modelId,
            'old_values'     => json_encode($old),
            'new_values'     => json_encode($new),
            'url'            => $request->fullUrl(),
            'ip_address'     => $request->ip(),
            'user_agent'     => $request->userAgent(),
        ]);
    }
"""
if "private function log(" not in content:
    content = content.replace("class Phase3Controller extends Controller\n{", "class Phase3Controller extends Controller\n{" + log_method)

# Helper config for each module
modules = [
    {
        "prefix": "qc",
        "table": "qc_inspections",
        "type": "QCInspection",
        "allowed_statuses": "['Draft', 'Pending']"
    },
    {
        "prefix": "scrap",
        "table": "production_scraps",
        "type": "Scrap",
        "allowed_statuses": "['Draft', 'Pending']"
    },
    {
        "prefix": "rework",
        "table": "production_reworks",
        "type": "Rework",
        "allowed_statuses": "['Draft', 'Pending']"
    },
    {
        "prefix": "machine",
        "table": "machines",
        "type": "Machine",
        "allowed_statuses": "['Active', 'Inactive']"
    },
    {
        "prefix": "maintenance",
        "table": "machine_maintenance_logs",
        "type": "Maintenance",
        "allowed_statuses": "['Scheduled', 'Pending']"
    },
    {
        "prefix": "downtime",
        "table": "machine_downtimes",
        "type": "Downtime",
        "allowed_statuses": "['Open', 'Pending']"
    },
    {
        "prefix": "capacity",
        "table": "capacity_plans",
        "type": "CapacityPlan",
        "allowed_statuses": "['Draft', 'Pending']"
    },
    {
        "prefix": "costing",
        "table": "production_costs",
        "type": "ProductionCost",
        "allowed_statuses": "['Draft', 'Pending']"
    }
]

# 3. Update store and destroy for each module
for mod in modules:
    prefix = mod["prefix"]
    table = mod["table"]
    typ = mod["type"]
    allowed = mod["allowed_statuses"]
    
    # Update Store
    store_def = f"public function {prefix}Store(Request $request): JsonResponse"
    if store_def in content:
        # We need to insert the log call right before the return statement of store.
        # Let's find the insertGetId line, and the return line.
        store_regex = rf"(?s)(public function {prefix}Store\(Request \$request\): JsonResponse.*?)(return response\(\)->json.*?;)"
        
        def store_repl(m):
            block1 = m.group(1)
            block2 = m.group(2)
            if f"this->log($request, 'created', '{typ}'" in block1:
                return m.group(0) # already logged
            
            # For machine downtime, $request might not be cleanly available if we just append? No, it's there.
            log_line = f"        $this->log($request, 'created', '{typ}', $id, [], ['status' => 'Created/Draft']);\n        "
            return block1 + log_line + block2
            
        content = re.sub(store_regex, store_repl, content)

    # Update Destroy
    destroy_def_old = f"public function {prefix}Destroy(int $id): JsonResponse"
    destroy_def_new = f"public function {prefix}Destroy(int $id, Request $request): JsonResponse"
    
    if destroy_def_old in content or destroy_def_new in content:
        destroy_regex = rf"(?s)public function {prefix}Destroy\(int \$id(?:, Request \$request)?\): JsonResponse\s*\{{\s*(.*?)\s*\}}"
        
        def destroy_repl(m):
            body = m.group(1)
            if "Not found" in body:
                return m.group(0) # already updated
            
            new_body = f"""$row = DB::table('{table}')->find($id);
        if (!$row) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        if (!isset($row->status) || !in_array($row->status, {allowed})) {{
            return response()->json(['success' => false, 'message' => 'Cannot delete in current status'], 400);
        }}
        $oldStatus = $row->status ?? 'Unknown';
        DB::table('{table}')->where('id', $id)->update(['deleted_at' => now()]);
        $this->log($request, 'deleted', '{typ}', $id, ['status' => $oldStatus], []);
        return response()->json(['success' => true, 'message' => 'Deleted']);"""
            
            return f"public function {prefix}Destroy(int $id, Request $request): JsonResponse\n    {{\n        {new_body}\n    }}"
            
        content = re.sub(destroy_regex, destroy_repl, content)

with open(file_path, "w") as f:
    f.write(content)

print("Updated successfully")
