<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
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
     * Attempt login and return JWT token, or false if credentials are invalid.
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

    public function createToken(User $user): string
    {
        return JWTAuth::fromUser($user);
    }

    public function refreshToken(): string
    {
        return JWTAuth::refresh(JWTAuth::getToken());
    }
}