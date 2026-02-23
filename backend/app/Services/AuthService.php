<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public const REFRESH_COOKIE = 'refresh_token';

    public function register(array $data): User
    {
        $userData = [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password_hash' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'customer',
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
        ];

        return User::create($userData);
    }

    /**
     * Attempt login and return access token, or false if credentials are invalid.
     */
    public function login(array $credentials): string|false
    {
        return Auth::guard('api')->attempt($credentials);
    }

    public function logout(): void
    {
        Auth::guard('api')->logout();
    }

    public function me(): ?User
    {
        /** @var User|null */
        return Auth::guard('api')->user();
    }

    /**
     * Create short-lived access token (from config JWT_TTL, default 15 min).
     */
    public function createAccessToken(User $user): string
    {
        return JWTAuth::fromUser($user);
    }

    /**
     * Create long-lived refresh token (from config JWT_REFRESH_TTL).
     * Stored in httpOnly cookie by controller.
     */
    public function createRefreshToken(User $user): string
    {
        $factory = JWTAuth::factory();
        $originalTtl = $factory->getTTL();
        $factory->setTTL(config('jwt.refresh_ttl', 20160)); // 2 weeks default
        $token = JWTAuth::fromUser($user);
        $factory->setTTL($originalTtl);
        return $token;
    }

    /**
     * Refresh using token from cookie. Returns new access token.
     */
    public function refreshTokenFromCookie(): string
    {
        $token = request()->cookie(self::REFRESH_COOKIE);
        if (!$token) {
            throw new \Tymon\JWTAuth\Exceptions\JWTException('Refresh token not found');
        }
        JWTAuth::setToken($token);
        return JWTAuth::refresh();
    }
}