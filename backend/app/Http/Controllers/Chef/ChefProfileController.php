<?php

namespace App\Http\Controllers\Chef;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rules\Enum;
use App\Enums\Weekday;

class ChefProfileController extends Controller
{
    public function update(Request $request)
    {
        $chef = $request->user()->chefProfile;

        if (!$chef) {
            return response()->json(['message' => 'Chef profile not found'], 404);
        }

        $validated = $request->validate([
            'bio' => 'nullable|string|max:5000',

            'specialties' => 'nullable|array',
            'specialties.*' => 'string|max:100',

            'hourly_rate' => 'nullable|numeric|min:0|max:10000',

            'max_orders_per_cycle' => 'required|integer|min:1|max:15',

            'delivery_day' => ['required', new Enum(Weekday::class)],
            'cutoff_day' => ['required', new Enum(Weekday::class)],

            'cutoff_time' => 'required|date_format:H:i',

            'is_paused' => 'boolean',
        ]);

        $chef->update($validated);

        return response()->json($chef->fresh());
    }
}
