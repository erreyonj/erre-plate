<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChefController;

Route::middleware('auth:api', 'role:chef')->group(function () {
    Route::get('/dashboard', [ChefController::class, 'dashboard']);
});
