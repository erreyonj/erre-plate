<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function dashboard()
    {
        return response()->json(['message' => 'Customer dashboard']);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'dietary_preferences' => ['nullable', 'string'],
            'allergies' => ['nullable', 'string'],
        ]);

        $user->fill($data);
        $user->save();

        return response()->json([
            'user' => $user,
        ]);
    }
}