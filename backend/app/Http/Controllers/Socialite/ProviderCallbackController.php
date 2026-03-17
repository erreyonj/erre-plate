<?php

namespace App\Http\Controllers\Socialite;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\Cookie;

class ProviderCallbackController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * Attach refresh token cookie to the response.
     */
    private function attachRefreshCookie(JsonResponse $response, string $refreshToken): JsonResponse
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
    public function __invoke(string $provider): JsonResponse
    {
        if (!in_array($provider, ['google', 'facebook', 'twitter', 'linkedin'])) {
            return response()->json(['error' => 'Invalid provider'], 400);
        }

        try {
            $socialiteUser = Socialite::driver($provider)->user();

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
                $user->role = 'customer';
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

            $response = response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $accessToken,
                'refreshToken' => $refreshToken,
                'token_type' => 'bearer',
            ]);

            return $this->attachRefreshCookie($response, $refreshToken);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
