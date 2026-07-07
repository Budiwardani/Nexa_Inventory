<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Domain\Models\JournalHeader;
use App\Modules\Core\Domain\Models\ChartOfAccount;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AccountingService
{
    /**
     * @param array $data {
     *   'journal_date': 'Y-m-d',
     *   'reference_type': string,
     *   'reference_id': int,
     *   'description': string,
     *   'entries': [
     *      ['account_code' => '...', 'debit' => 0, 'credit' => 100, 'cost_center' => '...', 'project_code' => '...', 'department' => '...']
     *   ]
     * }
     */
    public function postJournalEntry(array $data): JournalHeader
    {
        return DB::transaction(function () use ($data) {
            $totalDebit = collect($data['entries'])->sum('debit');
            $totalCredit = collect($data['entries'])->sum('credit');

            if (abs($totalDebit - $totalCredit) > 0.01) {
                throw new \Exception("Journal entry is unbalanced. Debit: {$totalDebit}, Credit: {$totalCredit}");
            }

            $journalNumber = 'JE-' . date('Ymd') . '-' . strtoupper(Str::random(4));

            $header = JournalHeader::create([
                'journal_number' => $journalNumber,
                'journal_date' => $data['journal_date'] ?? date('Y-m-d'),
                'reference_type' => $data['reference_type'] ?? null,
                'reference_id' => $data['reference_id'] ?? null,
                'description' => $data['description'] ?? null,
                'total_amount' => $totalDebit,
            ]);

            foreach ($data['entries'] as $entry) {
                $account = ChartOfAccount::where('account_code', $entry['account_code'])->first();
                if (!$account) {
                    // For the sake of the demo, if account doesn't exist, we auto-create it.
                    $account = ChartOfAccount::create([
                        'account_code' => $entry['account_code'],
                        'account_name' => 'Auto-generated ' . $entry['account_code'],
                        'account_type' => 'Asset', // Defaulting for demo
                    ]);
                }

                $header->details()->create([
                    'chart_of_account_id' => $account->id,
                    'debit' => $entry['debit'] ?? 0,
                    'credit' => $entry['credit'] ?? 0,
                    'cost_center' => $entry['cost_center'] ?? null,
                    'project_code' => $entry['project_code'] ?? null,
                    'department' => $entry['department'] ?? null,
                ]);
            }

            return $header;
        });
    }
}
