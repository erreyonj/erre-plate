<?php

namespace App\Http\Controllers\Chef;

use App\Http\Controllers\Controller;
use App\Models\Dish;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class DishController extends Controller
{
    /**
     * Get the authenticated chef's profile id.
     */
    private function chefProfileId(): int
    {
        $user = Auth::user();
        $profile = $user?->chefProfile;

        if (! $profile) {
            abort(403, 'Chef profile not found.');
        }

        return (int) $profile->id;
    }

    /**
     * GET /api/chef/dishes — list of the chef's dishes.
     */
    public function index(Request $request): JsonResponse
    {
        $chefId = $this->chefProfileId();

        $dishes = Dish::query()
            ->where('chef_profile_id', $chefId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($dishes);
    }

    /**
     * POST /api/chef/dishes — create a new dish for the authenticated chef.
     */
    public function store(Request $request): JsonResponse
    {
        $chefId = $this->chefProfileId();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'meal_type' => ['required', 'string', Rule::in(['breakfast', 'lunch', 'dinner'])],
            'prep_time_minutes' => ['nullable', 'integer', 'min:1', 'max:600'],
            'ingredients' => ['nullable', 'array'],
            'ingredients.*.name' => ['required_with:ingredients', 'string', 'max:255'],
            'ingredients.*.quantity' => ['nullable', 'string', 'max:50'],
            'ingredients.*.unit' => ['nullable', 'string', 'max:50'],
            'dietary_tags' => ['nullable', 'array'],
            'dietary_tags.*' => ['string', 'max:50'],
            'metadata' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        $dish = new Dish([
            'chef_profile_id' => $chefId,
            'name' => $validated['name'],
            'description' => $validated['description'],
            'meal_type' => $validated['meal_type'],
            'prep_time_minutes' => $validated['prep_time_minutes'] ?? null,
            'ingredients' => $validated['ingredients'] ?? null,
            'dietary_tags' => $validated['dietary_tags'] ?? null,
            'metadata' => $validated['metadata'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $dish->save();

        return response()->json($dish, 201);
    }

    /**
     * GET /api/chef/dishes/{dish} — show a single dish (must belong to chef).
     */
    public function show(Dish $dish): JsonResponse
    {
        $this->authorize('view', $dish);

        return response()->json($dish);
    }

    /**
     * PATCH /api/chef/dishes/{dish} — update a dish.
     */
    public function update(Request $request, Dish $dish): JsonResponse
    {
        $this->authorize('update', $dish);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'meal_type' => ['sometimes', 'string', Rule::in(['breakfast', 'lunch', 'dinner'])],
            'prep_time_minutes' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:600'],
            'ingredients' => ['sometimes', 'nullable', 'array'],
            'ingredients.*.name' => ['required_with:ingredients', 'string', 'max:255'],
            'ingredients.*.quantity' => ['nullable', 'string', 'max:50'],
            'ingredients.*.unit' => ['nullable', 'string', 'max:50'],
            'dietary_tags' => ['sometimes', 'nullable', 'array'],
            'dietary_tags.*' => ['string', 'max:50'],
            'metadata' => ['sometimes', 'nullable', 'array'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $dish->fill($validated);
        $dish->save();

        return response()->json($dish);
    }

    /**
     * DELETE /api/chef/dishes/{dish} — soft delete/hard delete the dish.
     */
    public function destroy(Dish $dish): JsonResponse
    {
        $this->authorize('update', $dish);

        $dish->delete();

        return response()->json(null, 204);
    }
}

