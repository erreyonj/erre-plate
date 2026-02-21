<?php

namespace App\Http\Controllers;

class CustomerController extends Controller
{
    public function dashboard()
    {
        return response()->json(['message' => 'Customer dashboard']);
    }
}