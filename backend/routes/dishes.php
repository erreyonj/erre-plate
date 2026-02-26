<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Chef\DishController;

Route::middleware('auth:api', 'role:chef')
    ->prefix('chef')
    ->group(function () {
        Route::get('/dishes', [DishController::class, 'index']);
        Route::post('/dishes', [DishController::class, 'store']);
        Route::get('/dishes/{dish}', [DishController::class, 'show']);
        Route::patch('/dishes/{dish}', [DishController::class, 'update']);
        Route::delete('/dishes/{dish}', [DishController::class, 'destroy']);
    });

