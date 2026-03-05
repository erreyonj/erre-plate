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

Route::get('/phpinfo-test', function () {
    phpinfo();
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

Route::get('/debug-env', function() {
    return response()->json([
        'app_env' => env('APP_ENV'),
        'cors_origins' => env('CORS_ALLOWED_ORIGINS'),
    ]);
});


// routes/api.php - temporary
Route::get('/debug-boot', function () {
    return response()->json([
        'app_env' => env('APP_ENV'),
        'app_key_set' => !empty(env('APP_KEY')),
        'db_connection' => env('DB_CONNECTION'),
        'db_host' => env('DB_HOST'),
        'db_database' => env('DB_DATABASE'),
        'db_connected' => DB::connection()->getPdo() ? true : false,
    ]);
});