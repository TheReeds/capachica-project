<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Broadcast::routes([
            'middleware' => ['web', 'auth:sanctum'], // Requerido si usas cookies
        ]); // O 'auth:api' si usas Passport/JWT
        require base_path('routes/channels.php');
    }
}
