<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Chef\ChefProfileController;


Route::middleware('auth:api, role:customer')->group(function () {

    // Get current user profile
    Route::get('/profile', [ProfileController::class, 'show']);

    // Update base user info (customer fields)
    Route::put('/profile', [ProfileController::class, 'update']);

});


Route::middleware('auth:api, role:chef')->group(function () {
    // Chef-specific profile
    Route::get('/profile/chef', [ChefProfileController::class, 'show']);
    Route::put('/profile/chef', [ChefProfileController::class, 'update']);
});