<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;

Route::middleware('auth:api', 'role:customer')->group(function () {
    Route::get('/dashboard', [CustomerController::class, 'dashboard']);
});