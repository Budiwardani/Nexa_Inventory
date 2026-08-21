<?php

namespace Tests\Feature;

use App\Modules\Core\Domain\Models\Company;
use App\Modules\Core\Domain\Models\Branch;
use App\Modules\Core\Domain\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class Phase3RefactorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([
            \Database\Seeders\RoleSeeder::class,
            \Database\Seeders\PermissionSeeder::class,
            \Database\Seeders\ProductionOrderPermissionSeeder::class,
        ]);
    }

    public function test_can_create_and_list_qc_inspection()
    {
        $company = Company::create(['code' => 'TEST-CO', 'name' => 'Test Co', 'is_active' => true]);
        $branch = Branch::create(['company_id' => $company->id, 'code' => 'TEST-BR', 'name' => 'Test Branch', 'is_active' => true]);

        $user = User::factory()->create([
            'branch_id' => $branch->id,
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/qc-inspections', [
            'inspection_type' => 'In-Process',
            'product' => 'Component X',
            'inspection_date' => '2026-08-21',
            'sample_qty' => 10,
            'pass_qty' => 9,
            'fail_qty' => 1,
            'result' => 'Pass',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.product', 'Component X');

        $this->assertDatabaseHas('qc_inspections', [
            'product' => 'Component X',
            'sample_qty' => 10,
            'result' => 'Pass',
        ]);

        $listResponse = $this->actingAs($user)->getJson('/api/v1/qc-inspections');
        $listResponse->assertStatus(200);
        $listResponse->assertJsonPath('success', true);
    }

    public function test_can_create_and_list_machine_and_maintenance()
    {
        $company = Company::create(['code' => 'TEST-CO', 'name' => 'Test Co', 'is_active' => true]);
        $branch = Branch::create(['company_id' => $company->id, 'code' => 'TEST-BR', 'name' => 'Test Branch', 'is_active' => true]);

        $user = User::factory()->create([
            'branch_id' => $branch->id,
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/machines', [
            'machine_name' => 'CNC Milling Machine #1',
            'work_center' => 'Machining Center A',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('success', true);
        $machineId = $response->json('data.id');

        $maintResponse = $this->actingAs($user)->postJson('/api/v1/maintenance-logs', [
            'machine_id' => $machineId,
            'maintenance_type' => 'Preventive',
            'scheduled_date' => '2026-08-25',
            'technician' => 'John Doe',
        ]);

        $maintResponse->assertStatus(201);
        $maintResponse->assertJsonPath('success', true);
    }
}
