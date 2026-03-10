<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Chef\ChefOrderController;

/*
|--------------------------------------------------------------------------
| Orders Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:api', 'role:customer'])->group(function () {

    // List the authenticated customer's orders
    Route::get('/orders', [OrderController::class, 'index']);

    // Place a new order
    Route::post('/orders', [OrderController::class, 'store']);

    // View a single order
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    // Cancel an order
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
});

/*
|--------------------------------------------------------------------------
| Chef Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:api', 'role:chef'])->prefix('chef')->group(function () {

    // List incoming orders for the chef
    Route::get('/orders', [ChefOrderController::class, 'index']);

    // Update the status of an order
    Route::patch('/orders/{order}/status', [ChefOrderController::class, 'updateStatus']);
});
