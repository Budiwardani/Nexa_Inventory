<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->prefix('api/v1')->group(function () {
    // Core Module Routes
    Route::post('/login', [\App\Modules\Core\Presentation\Controllers\AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [\App\Modules\Core\Presentation\Controllers\AuthController::class, 'logout']);
        Route::get('/me', [\App\Modules\Core\Presentation\Controllers\AuthController::class, 'me']);
        
        Route::apiResource('/users', \App\Modules\Core\Presentation\Controllers\UserController::class);
    });
});
