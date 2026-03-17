<?php

namespace App\Http\Controllers\Socialite;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;


class ProviderRedirectController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $provider)
    {
        if (!in_array($provider, ['google', 'facebook', 'twitter', 'linkedin'])) {
            return response()->json(['error' => 'Invalid provider'], 400);
        }

        try {
            return Socialite::driver($provider)->redirect();
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
