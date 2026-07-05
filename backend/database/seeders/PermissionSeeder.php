<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Users
            ['module' => 'Core', 'name' => 'users.view', 'description' => 'View users'],
            ['module' => 'Core', 'name' => 'users.create', 'description' => 'Create users'],
            ['module' => 'Core', 'name' => 'users.edit', 'description' => 'Edit users'],
            ['module' => 'Core', 'name' => 'users.delete', 'description' => 'Delete users'],
            
            // Roles
            ['module' => 'Core', 'name' => 'roles.view', 'description' => 'View roles'],
            ['module' => 'Core', 'name' => 'roles.create', 'description' => 'Create roles'],
            ['module' => 'Core', 'name' => 'roles.edit', 'description' => 'Edit roles'],
            ['module' => 'Core', 'name' => 'roles.delete', 'description' => 'Delete roles'],
            
            // Branches
            ['module' => 'Core', 'name' => 'branches.view', 'description' => 'View branches'],
        ];

        foreach ($permissions as $permission) {
            $permission['created_at'] = now();
            $permission['updated_at'] = now();
            $id = DB::table('permissions')->insertGetId($permission);
            
            // Assign all permissions to Super Admin
            $superAdminId = DB::table('roles')->where('name', 'Super Admin')->value('id');
            if ($superAdminId) {
                DB::table('role_permissions')->insert([
                    'role_id' => $superAdminId,
                    'permission_id' => $id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
