<?php

namespace App\Http\Controllers;

class ChefController extends Controller
{
    public function dashboard()
    {
        return response()->json(['message' => 'Chef dashboard']);
    }
}