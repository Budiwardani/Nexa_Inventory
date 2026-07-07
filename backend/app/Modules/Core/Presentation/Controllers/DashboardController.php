<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Modules\Core\Domain\Models\Inventory;
use App\Modules\Core\Domain\Models\WorkOrder;
use App\Modules\Core\Domain\Models\ProductionOrder;
use App\Modules\Core\Domain\Models\User;

class DashboardController extends Controller
{
    public function metrics(): JsonResponse
    {
        $totalUsers = User::count();
        $totalWorkOrders = WorkOrder::count();
        $totalProductionOrders = ProductionOrder::count();
        
        // Ensure that qty and unit_cost exist in db and sum properly
        $inventoryValue = Inventory::sum(DB::raw('qty * unit_cost'));
        $totalInventoryItems = Inventory::sum('qty');

        $activeWorkOrders = WorkOrder::whereNotIn('status', ['Completed', 'Cancelled'])->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'total_work_orders' => $totalWorkOrders,
                'active_work_orders' => $activeWorkOrders,
                'total_production_orders' => $totalProductionOrders,
                'inventory_value' => (float) $inventoryValue,
                'total_inventory_items' => (float) $totalInventoryItems,
            ]
        ]);
    }
}
