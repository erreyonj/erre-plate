<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
{
    $this->routes(function () {

        Route::middleware('api')
            ->prefix('api')
            ->group(function () {

                require base_path('routes/api.php');
                require base_path('routes/auth.php');
                require base_path('routes/customers.php');
                require base_path('routes/admin.php');
                require base_path('routes/chefs.php');
                require base_path('routes/dishes.php');
                require base_path('routes/orders.php');
                require base_path('routes/profiles.php');
            });

    });
}
}