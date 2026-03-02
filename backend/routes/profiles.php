<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Chef\ChefProfileController;


Route::middleware(['auth:api'])->group(function () {

    // Get current user profile
    Route::get('/profile', [ProfileController::class, 'show']);

    // Update base user info (customer fields)
    Route::put('/profile', [ProfileController::class, 'update']);

});

Route::middleware(['auth:api'])->group(function () {
    Route::get('/chefs', [ProfileController::class, 'index']);
    Route::get('/chefs/:slug', [ProfileController::class, 'showPublic']);
});


// Chef specific PROFILE routes
Route::middleware(['auth:api', 'role:chef'])->group(function () {
    Route::get('/profile/chef/me', [ChefProfileController::class, 'me']);
    Route::put('/profile/chef', [ChefProfileController::class, 'update']);
});

Route::middleware(['auth:api'])->group(function(){
    Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto']);
});