<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UrlController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',                        [AuthController::class, 'logout']);
    Route::get('/me',                             [AuthController::class, 'me']);
    Route::get('/dashboard',                      [DashboardController::class, 'index']);
    Route::get('/urls/{url}/analytics',           [AnalyticsController::class, 'index']);
    Route::apiResource('urls',                    UrlController::class);
});
