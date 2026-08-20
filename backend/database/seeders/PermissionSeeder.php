<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            'dashboard', 'production', 'boms', 'routings', 'production-orders',
            'work-orders', 'inventories', 'warehouses', 'stock-ledger',
            'stock-adjustments', 'stock-transfers', 'departments', 'material-issues',
            'material-returns', 'finished-goods', 'quality-control', 'scraps',
            'reworks', 'machines', 'maintenance', 'downtimes', 'capacity-plans',
            'production-costs', 'chart-of-accounts', 'journals', 'units',
            'unit-conversions', 'product-unit-mappings', 'reports', 'notifications',
            'suppliers', 'purchase-orders', 'goods-receipts', 'settings', 'branding',
            'users', 'roles', 'branches',
        ];

        $actions = ['view', 'create', 'edit', 'delete'];
        $permissions = [];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $permissions[] = [
                    'module' => ucfirst(str_replace('-', ' ', $module)),
                    'name' => "{$module}.{$action}",
                    'description' => ucfirst($action) . ' ' . str_replace('-', ' ', $module),
                ];
            }
        }

        foreach ([
            'production-orders.approve', 'production-orders.reject', 'production-orders.release',
            'production-orders.complete', 'production-orders.cancel', 'stock-adjustments.post',
            'stock-transfers.ship', 'stock-transfers.receive', 'purchase-orders.approve',
            'goods-receipts.receive', 'notifications.read',
        ] as $name) {
            [$module, $action] = explode('.', $name);
            $permissions[] = [
                'module' => ucfirst(str_replace('-', ' ', $module)),
                'name' => $name,
                'description' => ucfirst($action) . ' ' . str_replace('-', ' ', $module),
            ];
        }

        $superAdminId = DB::table('roles')->where('name', 'Super Admin')->value('id');
        $superAdminPermissionIds = [];

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

            if ($superAdminId && $permissionId) {
                $superAdminPermissionIds[] = $permissionId;
            }
        }

        if ($superAdminId) {
            DB::table('role_permissions')
                ->where('role_id', $superAdminId)
                ->whereNotIn('permission_id', $superAdminPermissionIds)
                ->delete();

            foreach ($superAdminPermissionIds as $permissionId) {
                DB::table('role_permissions')->updateOrInsert(
                    ['role_id' => $superAdminId, 'permission_id' => $permissionId],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }
        }
    }
}
