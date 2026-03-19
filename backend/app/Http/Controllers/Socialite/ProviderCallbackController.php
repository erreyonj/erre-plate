<?php

namespace App\Http\Controllers\Socialite;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuthService;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;

class ProviderCallbackController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * Attach refresh token cookie to the response.
     */
    private function attachRefreshCookie(Response $response, string $refreshToken): Response
    {
        $minutes = (int) config('jwt.refresh_ttl', 20160);

        $response->headers->setCookie(
            Cookie::create(AuthService::REFRESH_COOKIE)
                ->withValue($refreshToken)
                ->withPath('/')
                // ->withMaxAge($minutes * 60)
                ->withHttpOnly(true)
                ->withSecure(request()->secure())
                ->withSameSite('lax')
        );

        return $response;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(string $provider): Response
    {
        if (!in_array($provider, ['google', 'facebook', 'twitter', 'linkedin'])) {
            return response()->json(['error' => 'Invalid provider'], 400);
        }

        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver = Socialite::driver($provider);
            $socialiteUser = $driver->stateless()->user();

            // We break this up here instead of User::updateOrCreate() becasuse we dont have a user_provider table or unique provider_id column rules
            $email = $socialiteUser->getEmail();
            $providerId = $socialiteUser->getId();
            $name = $socialiteUser->getName() ?? '';

            $firstName = null;
            $lastName = null;

            if ($name !== '') {
                $parts = preg_split('/\s+/', trim($name), 2);
                $firstName = $parts[0] ?? null;
                $lastName = $parts[1] ?? null;
            }

            // Prefer existing user by email if available
            if ($email) {
                $user = User::where('email', $email)->first();
            } else {
                $user = null;
            }

            // Fallback: lookup by provider id
            if (!$user && $providerId) {
                $user = User::where('provider_id', $providerId)->first();
            }

            if (!$user) {
                $user = new User();
                $user->email = $email;
                $user->role = null;
            }

            $user->first_name = $user->first_name ?? $firstName;
            $user->last_name = $user->last_name ?? $lastName;
            $user->provider_id = $providerId;
            $user->provider_name = $provider;
            $user->provider_token = $socialiteUser->token ?? null;
            $user->provider_refresh_token = $socialiteUser->refreshToken ?? null;

            // password_hash may remain null for social-only accounts
            $user->save();

            $user->refresh();

            $accessToken = $this->authService->createAccessToken($user);
            $refreshToken = $this->authService->createRefreshToken($user);

            // We intentionally avoid placing tokens into URL query params.
            // The SPA should restore session via refresh cookie.
            $frontendUrl = rtrim((string) config('app.frontend_url'), '/');
            $redirectTo = $frontendUrl . '/onboarding/social';

            $response = redirect()->away($redirectTo);

            return $this->attachRefreshCookie($response, $refreshToken);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
