<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Chef\ChefEditProfileController;

// Authorized Users can GET and UPDATE their profile
Route::middleware(['auth:api'])->group(function () {

    // Get current user profile
    Route::get('/profile', [ProfileController::class, 'show']);

    // Update base user info (customer fields)
    Route::put('/profile', [ProfileController::class, 'update']);

});

// Authorized Users can GET chefs
Route::middleware(['auth:api'])->group(function () {
    // Full Index of public profiles (by neighborhood currently)
    Route::get('/chefs', [ProfileController::class, 'index']);
    // Get single chef public profile
    Route::get('/chefs/:slug', [ProfileController::class, 'showPublicChef']);
});

// Authorized Users can POST their photo
Route::middleware(['auth:api'])->group(function(){
    Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto']);
});

// Chef specific PROFILE routes
Route::middleware(['auth:api', 'role:chef'])->group(function () {
    Route::get('/profile/chef/me', [ChefEditProfileController::class, 'me']);
    Route::put('/profile/chef', [ChefEditProfileController::class, 'update']);
});
