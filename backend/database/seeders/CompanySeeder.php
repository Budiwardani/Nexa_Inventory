<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('companies')->insert([
            'name' => 'Nexa Manufacturing Global',
            'code' => 'NEXA-GLB',
            'address' => '123 Enterprise Way, Tech City',
            'email' => 'hq@nexa-mfg.com',
            'phone' => '+1-555-0100',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
