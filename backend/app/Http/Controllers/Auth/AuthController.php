<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Cookie;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

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

    private function clearRefreshCookie(JsonResponse $response): JsonResponse
    {
        $response->headers->clearCookie(AuthService::REFRESH_COOKIE, '/');
        return $response;
    }

    /**
     * Register a new user.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'in:customer,chef,admin'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'array'],
        ]);

        $user = $this->authService->register($validated);
        $accessToken = $this->authService->createAccessToken($user);
        $refreshToken = $this->authService->createRefreshToken($user);

        $response = response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $accessToken,
            'token_type' => 'bearer',
        ], 201);

        return $this->attachRefreshCookie($response, $refreshToken);
    }

    /**
     * Login and return access token. Refresh token in httpOnly cookie.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $accessToken = $this->authService->login($credentials);

        if ($accessToken === false) {
            throw ValidationException::withMessages([
                'email' => ['The login credentials are incorrect.'],
            ]);
        }

        $user = $this->authService->me();
        $refreshToken = $this->authService->createRefreshToken($user);

        $response = response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $accessToken,
            'token_type' => 'bearer',
        ]);

        return $this->attachRefreshCookie($response, $refreshToken);
    }

    /**
     * Log the user out and clear refresh cookie.
     */
    public function logout(): JsonResponse
    {
        // Invalidate if we have a token (e.g. from Authorization header)
        try {
            $this->authService->logout();
        } catch (\Throwable) {
            // Ignore if no token
        }

        $response = response()->json(['message' => 'Successfully logged out']);
        return $this->clearRefreshCookie($response);
    }

    /**
     * Get the authenticated user.
     */
    public function me(): JsonResponse
    {
        $user = $this->authService->me();

        return response()->json(['user' => $user]);
    }

    /**
     * Refresh access token using httpOnly cookie. No Bearer token required.
     */
    public function refresh(): JsonResponse
    {
        $accessToken = $this->authService->refreshTokenFromCookie();

        return response()->json([
            'token' => $accessToken,
            'token_type' => 'bearer',
        ]);
    }
}
