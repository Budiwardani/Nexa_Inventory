<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductionOrderPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['module' => 'Production', 'name' => 'production_orders.view', 'description' => 'View production orders'],
            ['module' => 'Production', 'name' => 'production_orders.create', 'description' => 'Create production orders'],
            ['module' => 'Production', 'name' => 'production_orders.edit', 'description' => 'Edit production orders'],
            ['module' => 'Production', 'name' => 'production_orders.approve', 'description' => 'Approve production orders'],
            ['module' => 'Production', 'name' => 'production_orders.release', 'description' => 'Release production orders'],
            ['module' => 'Production', 'name' => 'production_orders.close', 'description' => 'Close production orders'],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['name' => $permission['name']],
                [
                    'module' => $permission['module'],
                    'description' => $permission['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            $permissionId = DB::table('permissions')->where('name', $permission['name'])->value('id');
            $superAdminId = DB::table('roles')->where('name', 'Super Admin')->value('id');

            if ($superAdminId && $permissionId) {
                DB::table('role_permissions')->updateOrInsert(
                    ['role_id' => $superAdminId, 'permission_id' => $permissionId],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }
        }
    }
}
