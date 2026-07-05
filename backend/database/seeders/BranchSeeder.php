<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = DB::table('companies')->where('code', 'NEXA-GLB')->value('id');

        DB::table('branches')->updateOrInsert(
            ['company_id' => $companyId, 'code' => 'HQ-01'],
            [
                'name' => 'Headquarters',
                'address' => '123 Enterprise Way, Tech City',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('branches')->updateOrInsert(
            ['company_id' => $companyId, 'code' => 'PL-ALPHA'],
            [
                'name' => 'Plant Alpha',
                'address' => '456 Industrial Blvd, Factory Town',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
