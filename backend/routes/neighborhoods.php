<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NeighborhoodController;

Route::middleware('auth:api')->group(function () {

    Route::get('/neighborhoods', [NeighborhoodController::class, 'index']);

});