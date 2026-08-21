<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Domain\Models\FinishedGoodsReceipt;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class FinishedGoodsService
{
    public function __construct(
        protected AccountingService $accountingService
    ) {}

    public function getPaginatedReceipts(int $perPage = 15): LengthAwarePaginator
    {
        return FinishedGoodsReceipt::orderByDesc('id')->paginate($perPage);
    }

    public function findById(int $id): ?FinishedGoodsReceipt
    {
        return FinishedGoodsReceipt::find($id);
    }

    public function createReceipt(array $data): FinishedGoodsReceipt
    {
        return DB::transaction(function () use ($data) {
            $unitCost = $data['unit_cost'] ?? 0;
            $totalCost = $unitCost * $data['receipt_qty'];

            $receipt = FinishedGoodsReceipt::create([
                'product' => $data['product'],
                'variant' => $data['variant'] ?? null,
                'warehouse' => $data['warehouse'],
                'receipt_date' => $data['receipt_date'],
                'receipt_qty' => $data['receipt_qty'],
                'uom' => $data['uom'] ?? 'PCS',
                'batch_no' => $data['batch_no'] ?? null,
                'serial_no' => $data['serial_no'] ?? null,
                'unit_cost' => $unitCost,
                'total_cost' => $totalCost,
                'notes' => $data['notes'] ?? null,
                'status' => 'Draft',
            ]);

            if ($totalCost > 0) {
                $this->accountingService->postJournalEntry([
                    'journal_date' => $receipt->receipt_date,
                    'reference_type' => 'FinishedGoodsReceipt',
                    'reference_id' => $receipt->id,
                    'description' => 'Finished Goods Receipt from Production',
                    'entries' => [
                        ['account_code' => '11400', 'debit' => $totalCost, 'credit' => 0, 'department' => 'Warehouse'], // Debit Inventory
                        ['account_code' => '11500', 'debit' => 0, 'credit' => $totalCost, 'department' => 'Production'], // Credit WIP
                    ]
                ]);
            }

            return $receipt;
        });
    }

    public function updateReceipt(int $id, array $data): ?FinishedGoodsReceipt
    {
        $receipt = FinishedGoodsReceipt::find($id);
        if (!$receipt) return null;

        $receipt->update(array_intersect_key($data, array_flip(['status', 'notes'])));
        return $receipt;
    }

    public function deleteReceipt(int $id): FinishedGoodsReceipt
    {
        $receipt = FinishedGoodsReceipt::find($id);
        if (!$receipt) {
            throw new \Exception('Not found');
        }

        if ($receipt->status !== 'Draft') {
            throw new \DomainException('Only draft receipts can be deleted');
        }

        $receipt->delete();
        return $receipt;
    }
}
