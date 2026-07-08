<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->prefix('v1')->group(function () {
    // Core Module Routes
    Route::post('/login', [\App\Modules\Core\Presentation\Controllers\AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [\App\Modules\Core\Presentation\Controllers\AuthController::class, 'logout']);
        Route::get('/me', [\App\Modules\Core\Presentation\Controllers\AuthController::class, 'me']);
        
        // Users
        Route::apiResource('/users', \App\Modules\Core\Presentation\Controllers\UserController::class);

        // Roles & Permissions
        Route::apiResource('/roles', \App\Modules\Core\Presentation\Controllers\RoleController::class);
        Route::get('/permissions', [\App\Modules\Core\Presentation\Controllers\PermissionController::class, 'index']);

        // Manufacturing Modules
        Route::apiResource('/production-orders', \App\Modules\Core\Presentation\Controllers\ProductionOrderController::class);
        Route::post('/production-orders/{id}/approve',  [\App\Modules\Core\Presentation\Controllers\ProductionOrderController::class, 'approve']);
        Route::post('/production-orders/{id}/reject',   [\App\Modules\Core\Presentation\Controllers\ProductionOrderController::class, 'reject']);
        Route::post('/production-orders/{id}/cancel',   [\App\Modules\Core\Presentation\Controllers\ProductionOrderController::class, 'cancel']);
        Route::post('/production-orders/{id}/release',  [\App\Modules\Core\Presentation\Controllers\ProductionOrderController::class, 'release']);
        Route::post('/production-orders/{id}/complete', [\App\Modules\Core\Presentation\Controllers\ProductionOrderController::class, 'complete']);
        Route::get('/production-orders/{id}/logs',      [\App\Modules\Core\Presentation\Controllers\ProductionOrderController::class, 'logs']);

        Route::apiResource('/boms', \App\Modules\Core\Presentation\Controllers\BomController::class);
        Route::apiResource('/routings', \App\Modules\Core\Presentation\Controllers\RoutingController::class);
        Route::apiResource('/work-orders', \App\Modules\Core\Presentation\Controllers\WorkOrderController::class);
        Route::apiResource('/material-issues', \App\Modules\Core\Presentation\Controllers\MaterialIssueController::class);
        Route::apiResource('/material-returns', \App\Modules\Core\Presentation\Controllers\MaterialReturnController::class);
        Route::apiResource('/finished-goods', \App\Modules\Core\Presentation\Controllers\FinishedGoodsController::class);

        // Inventory & Settings (Phase 3 APIs)
        Route::apiResource('/inventories', \App\Modules\Core\Presentation\Controllers\InventoryController::class);
        Route::apiResource('/settings', \App\Modules\Core\Presentation\Controllers\SettingsController::class);
        Route::get('/dashboard/metrics', [\App\Modules\Core\Presentation\Controllers\DashboardController::class, 'metrics']);

        // Phase 3: QC, Scrap, Rework, Machines, Maintenance, Downtime, Capacity, Costing, Notifications
        $p3 = \App\Modules\Core\Presentation\Controllers\Phase3Controller::class;
        Route::get('/qc-inspections', [$p3, 'qcIndex']);
        Route::post('/qc-inspections', [$p3, 'qcStore']);
        Route::delete('/qc-inspections/{id}', [$p3, 'qcDestroy']);

        Route::get('/scraps', [$p3, 'scrapIndex']);
        Route::post('/scraps', [$p3, 'scrapStore']);
        Route::delete('/scraps/{id}', [$p3, 'scrapDestroy']);

        Route::get('/reworks', [$p3, 'reworkIndex']);
        Route::post('/reworks', [$p3, 'reworkStore']);
        Route::delete('/reworks/{id}', [$p3, 'reworkDestroy']);

        Route::get('/machines', [$p3, 'machineIndex']);
        Route::post('/machines', [$p3, 'machineStore']);
        Route::delete('/machines/{id}', [$p3, 'machineDestroy']);

        Route::get('/maintenance-logs', [$p3, 'maintenanceIndex']);
        Route::post('/maintenance-logs', [$p3, 'maintenanceStore']);

        Route::get('/downtimes', [$p3, 'downtimeIndex']);
        Route::post('/downtimes', [$p3, 'downtimeStore']);

        Route::get('/capacity-plans', [$p3, 'capacityIndex']);
        Route::post('/capacity-plans', [$p3, 'capacityStore']);

        Route::get('/production-costs', [$p3, 'costingIndex']);
        Route::post('/production-costs', [$p3, 'costingStore']);

        Route::get('/notifications', [$p3, 'notifIndex']);
        Route::post('/notifications', [$p3, 'notifStore']);
        Route::patch('/notifications/{id}/read', [$p3, 'notifMarkRead']);
    });
});
