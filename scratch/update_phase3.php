<?php
$filePath = 'C:\\Users\\Suswati\\Documents\\Nexa-inv\\backend\\app\\Modules\\Core\\Presentation\\Controllers\\Phase3Controller.php';
$content = file_get_contents($filePath);

// 1. Add AuditLog import
if (strpos($content, 'use App\\Modules\\Core\\Domain\\Models\\AuditLog;') === false) {
    $content = str_replace(
        "use Illuminate\\Support\\Facades\\DB;",
        "use Illuminate\\Support\\Facades\\DB;\nuse App\\Modules\\Core\\Domain\\Models\\AuditLog;",
        $content
    );
}

// 2. Add log method
$logMethod = <<<EOT
    private function log(Request \$request, string \$event, string \$type, int \$modelId, array \$old = [], array \$new = []): void
    {
        AuditLog::create([
            'user_id'        => \$request->user()?->id ?? auth()->id(),
            'event'          => \$event,
            'auditable_type' => \$type,
            'auditable_id'   => \$modelId,
            'old_values'     => json_encode(\$old),
            'new_values'     => json_encode(\$new),
            'url'            => \$request->fullUrl(),
            'ip_address'     => \$request->ip(),
            'user_agent'     => \$request->userAgent(),
        ]);
    }
EOT;

if (strpos($content, 'private function log(') === false) {
    $content = str_replace(
        "class Phase3Controller extends Controller\n{",
        "class Phase3Controller extends Controller\n{\n$logMethod\n",
        $content
    );
}

$modules = [
    ['prefix' => 'qc', 'table' => 'qc_inspections', 'type' => 'QCInspection', 'allowed' => "['Draft', 'Pending']"],
    ['prefix' => 'scrap', 'table' => 'production_scraps', 'type' => 'Scrap', 'allowed' => "['Draft', 'Pending']"],
    ['prefix' => 'rework', 'table' => 'production_reworks', 'type' => 'Rework', 'allowed' => "['Draft', 'Pending']"],
    ['prefix' => 'machine', 'table' => 'machines', 'type' => 'Machine', 'allowed' => "['Active', 'Inactive']"],
    ['prefix' => 'maintenance', 'table' => 'machine_maintenance_logs', 'type' => 'Maintenance', 'allowed' => "['Scheduled', 'Pending']"],
    ['prefix' => 'downtime', 'table' => 'machine_downtimes', 'type' => 'Downtime', 'allowed' => "['Open', 'Pending']"],
    ['prefix' => 'capacity', 'table' => 'capacity_plans', 'type' => 'CapacityPlan', 'allowed' => "['Draft', 'Pending']"],
    ['prefix' => 'costing', 'table' => 'production_costs', 'type' => 'ProductionCost', 'allowed' => "['Draft', 'Pending']"]
];

foreach ($modules as $mod) {
    $prefix = $mod['prefix'];
    $table = $mod['table'];
    $type = $mod['type'];
    $allowed = $mod['allowed'];

    // Replace Store
    $storePattern = "/(public function {$prefix}Store\(Request \\\$request\): JsonResponse.*?)(return response\(\)->json.*?;\s*\})/s";
    $content = preg_replace_callback($storePattern, function($matches) use ($prefix, $type) {
        $block1 = $matches[1];
        $block2 = $matches[2];
        if (strpos($block1, "this->log(\$request, 'created'") !== false) return $matches[0];
        
        $logLine = "        \$this->log(\$request, 'created', '$type', \$id, [], ['status' => 'Created/Draft']);\n        ";
        return $block1 . $logLine . $block2;
    }, $content);

    // Replace Destroy
    $destroyOldPattern = "/public function {$prefix}Destroy\(int \\\$id\): JsonResponse\s*\{\s*DB::table\('$table'\)->where\('id', \\\$id\)->update\(\['deleted_at' => now\(\)\]\);\s*return response\(\)->json\(\['success' => true, 'message' => 'Deleted'\]\);\s*\}/s";
    
    $newDestroy = <<<EOT
public function {$prefix}Destroy(int \$id, Request \$request): JsonResponse
    {
        \$row = DB::table('$table')->find(\$id);
        if (!\$row) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        if (!isset(\$row->status) || !in_array(\$row->status, $allowed)) {
            return response()->json(['success' => false, 'message' => 'Cannot delete in current status'], 400);
        }
        \$oldStatus = \$row->status ?? 'Unknown';
        DB::table('$table')->where('id', \$id)->update(['deleted_at' => now()]);
        \$this->log(\$request, 'deleted', '$type', \$id, ['status' => \$oldStatus], []);
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }
EOT;

    $content = preg_replace($destroyOldPattern, $newDestroy, $content);
}

file_put_contents($filePath, $content);
echo "Updated successfully\n";
