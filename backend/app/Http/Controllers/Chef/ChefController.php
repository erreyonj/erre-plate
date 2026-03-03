<?php

namespace App\Http\Controllers;

use App\Models\ChefProfile;
use Illuminate\Http\Request;

class ChefController extends Controller
{
    public function dashboard()
    {
        return response()->json(['message' => 'Chef dashboard']);
    }

}