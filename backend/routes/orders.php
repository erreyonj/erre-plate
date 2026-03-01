<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| Orders Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Customer Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:customer')->prefix('customer')->group(function () {

        // Create order
        Route::post('/orders', [OrderController::class, 'store']);

        // View own orders
        Route::get('/orders', [OrderController::class, 'customerIndex']);

        // View single order
        Route::get('/orders/{order}', [OrderController::class, 'customerShow']);

        // Cancel order (only certain statuses allowed)
        Route::patch('/orders/{order}/cancel', [OrderController::class, 'cancel']);
    });

    /*
    |--------------------------------------------------------------------------
    | Chef Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:chef')->prefix('chef')->group(function () {

        // View orders assigned to chef
        Route::get('/orders', [OrderController::class, 'chefIndex']);

        // View specific order
        Route::get('/orders/{order}', [OrderController::class, 'chefShow']);

        // Update status
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
    });

});