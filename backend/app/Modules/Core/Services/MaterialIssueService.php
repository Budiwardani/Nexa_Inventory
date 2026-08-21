<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Domain\Models\MaterialIssueHeader;
use App\Modules\Core\Domain\Models\MaterialIssueItem;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class MaterialIssueService
{
    public function __construct(
        protected AccountingService $accountingService
    ) {}

    public function getPaginatedIssues(int $perPage = 15): LengthAwarePaginator
    {
        return MaterialIssueHeader::with('items')->orderByDesc('id')->paginate($perPage);
    }

    public function findById(int $id): ?MaterialIssueHeader
    {
        return MaterialIssueHeader::with('items')->find($id);
    }

    public function createIssue(array $data): MaterialIssueHeader
    {
        return DB::transaction(function () use ($data) {
            $header = MaterialIssueHeader::create([
                'issue_date' => $data['issue_date'],
                'warehouse' => $data['warehouse'] ?? null,
                'notes' => $data['notes'] ?? null,
                'status' => 'Draft',
            ]);

            foreach ($data['items'] as $item) {
                MaterialIssueItem::create([
                    'mi_header_id' => $header->id,
                    'material_code' => $item['material_code'],
                    'material_name' => $item['material_name'],
                    'required_qty' => $item['required_qty'],
                    'issued_qty' => $item['issued_qty'] ?? 0,
                    'uom' => $item['uom'] ?? null,
                ]);
            }

            // Post Journal Entry for Material Issue (Debit WIP, Credit Inventory)
            $totalCost = collect($data['items'])->sum(function ($item) {
                return ($item['issued_qty'] ?? 0) * 10;
            });

            if ($totalCost > 0) {
                $this->accountingService->postJournalEntry([
                    'journal_date' => $header->issue_date,
                    'reference_type' => 'MaterialIssue',
                    'reference_id' => $header->id,
                    'description' => 'Material Issue for Production',
                    'entries' => [
                        ['account_code' => '11500', 'debit' => $totalCost, 'credit' => 0, 'department' => 'Production'], // Debit WIP
                        ['account_code' => '11400', 'debit' => 0, 'credit' => $totalCost, 'department' => 'Warehouse'],  // Credit Inventory
                    ]
                ]);
            }

            return $header->load('items');
        });
    }

    public function deleteIssue(int $id): MaterialIssueHeader
    {
        $issue = MaterialIssueHeader::find($id);
        if (!$issue) {
            throw new \Exception('Not found');
        }

        if ($issue->status !== 'Draft') {
            throw new \DomainException('Only draft material issues can be deleted');
        }

        $issue->delete();
        return $issue;
    }
}
