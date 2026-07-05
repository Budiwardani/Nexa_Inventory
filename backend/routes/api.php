<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->prefix('api/v1')->group(function () {
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
    });
});
