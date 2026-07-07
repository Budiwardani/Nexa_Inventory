<?php

namespace Tests\Feature;

use App\Modules\Core\Domain\Models\User;
use App\Modules\Core\Domain\Models\Company;
use App\Modules\Core\Domain\Models\Branch;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ProductionOrderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed database for Roles and Permissions
        $this->seed([\Database\Seeders\RoleSeeder::class, \Database\Seeders\PermissionSeeder::class, \Database\Seeders\ProductionOrderPermissionSeeder::class]);
    }

    public function test_can_create_production_order()
    {
        $company = Company::create(['code' => 'TEST-CO', 'name' => 'Test Co', 'is_active' => true]);
        $branch = Branch::create(['company_id' => $company->id, 'code' => 'TEST-BR', 'name' => 'Test Branch', 'is_active' => true]);

        $user = User::factory()->create([
            'branch_id' => $branch->id,
        ]);

        $superAdminRole = DB::table('roles')->where('name', 'Super Admin')->value('id');
        DB::table('user_roles')->insert([
            'user_id' => $user->id,
            'role_id' => $superAdminRole,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/production-orders', [
            'production_order_no' => 'PO-TEST-001',
            'production_date' => '2026-07-06',
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'plant' => 'Plant Alpha',
            'warehouse' => 'Main Warehouse',
            'status' => 'Draft',
            'items' => [
                [
                    'product' => 'Product A',
                    'target_qty' => 100,
                    'uom' => 'PCS'
                ]
            ]
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('production_orders', [
            'production_order_no' => 'PO-TEST-001',
        ]);
    }

    public function test_cannot_create_without_permission()
    {
        $company = Company::create(['code' => 'TEST-CO', 'name' => 'Test Co', 'is_active' => true]);
        $branch = Branch::create(['company_id' => $company->id, 'code' => 'TEST-BR', 'name' => 'Test Branch', 'is_active' => true]);

        $user = User::factory()->create([
            'branch_id' => $branch->id,
        ]);
        // No role assigned

        $response = $this->actingAs($user)->postJson('/api/v1/production-orders', [
            'production_order_no' => 'PO-TEST-002',
            'production_date' => '2026-07-06',
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'items' => [
                ['product' => 'Product B', 'target_qty' => 50]
            ]
        ]);

        $response->assertStatus(403);
    }
}
