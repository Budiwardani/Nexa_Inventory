<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Super Admin', 'description' => 'System Administrator with full access'],
            ['name' => 'Plant Manager', 'description' => 'Manager of a specific manufacturing plant'],
            ['name' => 'Production Supervisor', 'description' => 'Supervisor for production lines'],
            ['name' => 'Operator', 'description' => 'Machine or line operator'],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['name' => $role['name']],
                [
                    'description' => $role['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
