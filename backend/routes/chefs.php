<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChefController;
use App\Http\Controllers\Chef\WeeklyMenuController;
use App\Http\Controllers\Chef\WeeklyMenuDishController;

Route::middleware('auth:api', 'role:chef')->prefix('chef')->group(function () {
    Route::get('/dashboard', [ChefController::class, 'dashboard']);

    Route::get('/weekly-menus', [WeeklyMenuController::class, 'index']);
    Route::post('/weekly-menus', [WeeklyMenuController::class, 'store']);
    Route::get('/weekly-menus/{menu}', [WeeklyMenuController::class, 'show']);
    Route::patch('/weekly-menus/{menu}', [WeeklyMenuController::class, 'update']);
    Route::patch('/weekly-menus/{menu}/publish', [WeeklyMenuController::class, 'publish']);
    Route::patch('/weekly-menus/{menu}/archive', [WeeklyMenuController::class, 'archive']);

    Route::post('/weekly-menus/{menu}/dishes', [WeeklyMenuDishController::class, 'store']);
    Route::patch('/weekly-menus/{menu}/dishes/{assignedDish}', [WeeklyMenuDishController::class, 'update']);
    Route::delete('/weekly-menus/{menu}/dishes/{assignedDish}', [WeeklyMenuDishController::class, 'destroy']);
});
