<?php
namespace App\Modules\Purchasing\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Purchasing\Application\Services\SupplierService;
use App\Modules\Purchasing\DTO\SupplierDTO;
use App\Modules\Core\Domain\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function __construct(
        private readonly SupplierService $service
    ) {}

    public function index(): JsonResponse
    {
        $suppliers = $this->service->getAllSuppliers();
        return response()->json(['success' => true, 'data' => $suppliers]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:suppliers,code'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'tax_id' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', 'string', 'in:Active,Inactive'],
        ]);

        $dto = SupplierDTO::fromArray(array_merge($validated, [
            'created_by' => $request->user()?->id,
        ]));

        $supplier = $this->service->createSupplier($dto);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'event' => 'created',
            'auditable_type' => 'Supplier',
            'auditable_id' => $supplier->id,
            'new_values' => json_encode(['code' => $supplier->code, 'name' => $supplier->name]),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['success' => true, 'message' => 'Supplier created', 'data' => $supplier], 201);
    }

    public function show(int $id): JsonResponse
    {
        $supplier = $this->service->getSupplierById($id);
        if (!$supplier) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        return response()->json(['success' => true, 'data' => $supplier->load('contacts')]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $supplier = $this->service->getSupplierById($id);
        if (!$supplier) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        $validated = $request->validate([
            'code' => ['sometimes', 'string', 'max:50', 'unique:suppliers,code,' . $id],
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'tax_id' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', 'string', 'in:Active,Inactive'],
        ]);

        $old = $supplier->only(['code', 'name', 'status']);
        $this->service->updateSupplier($id, SupplierDTO::fromArray(array_merge($supplier->toArray(), $validated)));

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'event' => 'updated',
            'auditable_type' => 'Supplier',
            'auditable_id' => $id,
            'old_values' => json_encode($old),
            'new_values' => json_encode($validated),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['success' => true, 'message' => 'Supplier updated', 'data' => $this->service->getSupplierById($id)]);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $supplier = $this->service->getSupplierById($id);
        if (!$supplier) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        if (!in_array($supplier->status, ['Active', 'Inactive'])) {
            return response()->json(['success' => false, 'message' => 'Cannot delete supplier in current state'], 400);
        }

        $old = ['code' => $supplier->code, 'name' => $supplier->name];
        $this->service->deleteSupplier($id);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'event' => 'deleted',
            'auditable_type' => 'Supplier',
            'auditable_id' => $id,
            'old_values' => json_encode($old),
            'new_values' => json_encode([]),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['success' => true, 'message' => 'Supplier deleted']);
    }
}
