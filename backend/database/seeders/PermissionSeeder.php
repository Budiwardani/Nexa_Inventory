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

            DB::table('permissions')->updateOrInsert(
                ['name' => $permission['name']],
                [
                    'module' => $permission['module'],
                    'description' => $permission['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            $permissionId = DB::table('permissions')
                ->where('name', $permission['name'])
                ->value('id');

            // Assign all permissions to Super Admin
            $superAdminId = DB::table('roles')->where('name', 'Super Admin')->value('id');
            if ($superAdminId && $permissionId) {
                $exists = DB::table('role_permissions')
                    ->where('role_id', $superAdminId)
                    ->where('permission_id', $permissionId)
                    ->exists();

                if (! $exists) {
                    DB::table('role_permissions')->insert([
                        'role_id' => $superAdminId,
                        'permission_id' => $permissionId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
