<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $branchId       = DB::table('branches')->where('code', 'HQ-01')->value('id');
        $superAdminRole = DB::table('roles')->where('name', 'Super Admin')->value('id');

        $users = [
            [
                'name'              => 'Super Administrator',
                'email'             => 'superadmin@nexa-mfg.com',
                'password'          => Hash::make('superadmin123'),
                'branch_id'         => $branchId,
                'email_verified_at' => now(),
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'name'              => 'Admin User',
                'email'             => 'admin@nexa-mfg.com',
                'password'          => Hash::make('password'),
                'branch_id'         => $branchId,
                'email_verified_at' => now(),
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ];

        foreach ($users as $userData) {
            // Skip if already exists
            if (DB::table('users')->where('email', $userData['email'])->exists()) {
                continue;
            }

            $userId = DB::table('users')->insertGetId($userData);

            if ($superAdminRole) {
                DB::table('user_roles')->insert([
                    'user_id'    => $userId,
                    'role_id'    => $superAdminRole,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
