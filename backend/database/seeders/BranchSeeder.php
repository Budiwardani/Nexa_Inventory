<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = DB::table('companies')->where('code', 'NEXA-GLB')->value('id');

        DB::table('branches')->insert([
            [
                'company_id' => $companyId,
                'name' => 'Headquarters',
                'code' => 'HQ-01',
                'address' => '123 Enterprise Way, Tech City',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => $companyId,
                'name' => 'Plant Alpha',
                'code' => 'PL-ALPHA',
                'address' => '456 Industrial Blvd, Factory Town',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
