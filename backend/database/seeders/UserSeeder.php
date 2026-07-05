<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $branchId = DB::table('branches')->where('code', 'HQ-01')->value('id');
        $superAdminRoleId = DB::table('roles')->where('name', 'Super Admin')->value('id');

        $userId = DB::table('users')->insertGetId([
            'name' => 'Admin User',
            'email' => 'admin@nexa-mfg.com',
            'password' => Hash::make('password'),
            'branch_id' => $branchId,
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($superAdminRoleId) {
            DB::table('user_roles')->insert([
                'user_id' => $userId,
                'role_id' => $superAdminRoleId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
