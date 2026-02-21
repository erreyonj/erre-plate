<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

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
            'role' => ['sometimes', 'string', 'in:customer,chef,admin'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'array'],
        ]);

        $user = $this->authService->register($validated);
        $token = $this->authService->createToken($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
        ], 201);
    }

    /**
     * Login and return JWT token.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $token = $this->authService->login($credentials);

        if ($token === false) {
            throw ValidationException::withMessages([
                'email' => ['The login credentials are incorrect.'],
            ]);
        }

        $user = $this->authService->me();

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
        ]);
    }

    /**
     * Log the user out (invalidate the token).
     */
    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return response()->json(['message' => 'Successfully logged out']);
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
     * Refresh a token.
     */
    public function refresh(): JsonResponse
    {
        $token = $this->authService->refreshToken();

        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
        ]);
    }
}
