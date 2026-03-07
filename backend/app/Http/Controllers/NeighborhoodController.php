<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Neighborhood;
use App\Http\Resources\NeighborhoodResource;

class NeighborhoodController extends Controller
{
    public function index(Request $request) 
    {
        $neighborhoods = Neighborhood::all();
        return NeighborhoodResource::collection($neighborhoods);
    }
}
