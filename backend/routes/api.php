<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/test', function() {
    return response()->json([
        'message' => 'errePlate API is live!',
        'timestamp' => now(),
        'database' => DB::connection()->getDatabaseName()
    ]);
});

Route::get('/health', function() {
    try {
        DB::connection()->getPdo();
        $dbStatus = 'connected';
    } catch (\Exception $e) {
        $dbStatus = 'disconnected';
    }
    
    return response()->json([
        'status' => 'ok',
        'database' => $dbStatus,
        'timestamp' => now()
    ]);
});