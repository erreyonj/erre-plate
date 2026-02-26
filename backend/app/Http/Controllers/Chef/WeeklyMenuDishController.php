<?php

namespace App\Http\Controllers\Chef;

use App\Http\Controllers\Controller;
use App\Http\Resources\WeeklyMenuResource;
use App\Models\Dish;
use App\Models\WeeklyMenu;
use App\Models\WeeklyMenuDish;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WeeklyMenuDishController extends Controller
{
    /**
     * POST /api/chef/weekly-menus/{menu}/dishes — attach dish to menu (draft only).
     */
    public function store(Request $request, WeeklyMenu $menu): JsonResponse
    {
        $this->authorize('update', $menu);

        $validated = $request->validate([
            'dish_id' => ['required', 'integer', 'exists:dishes,id'],
            'meals_covered' => ['integer', 'min:1', 'max:3'],
            'meal_type' => ['string', Rule::in(['breakfast', 'lunch', 'dinner'])],
        ]);

        $dish = Dish::findOrFail($validated['dish_id']);
        $this->authorize('view', $dish);

        $mealsCovered = (int) ($validated['meals_covered'] ?? 1);
        $mealType = $validated['meal_type'] ?? $dish->meal_type;

        $entry = new WeeklyMenuDish([
            'weekly_menu_id' => $menu->id,
            'dish_id' => $dish->id,
            'meals_covered' => $mealsCovered,
            'meal_type' => $mealType,
        ]);
        $entry->save();

        $menu->load('assignedDishes.dish');

        return response()->json(new WeeklyMenuResource($menu), 201);
    }

    /**
     * PATCH /api/chef/weekly-menus/{menu}/dishes/{assignedDish} — update meals_covered / meal_type.
     */
    public function update(Request $request, WeeklyMenu $menu, WeeklyMenuDish $assignedDish): JsonResponse
    {
        $this->authorize('update', $assignedDish);

        if ((int) $assignedDish->weekly_menu_id !== (int) $menu->id) {
            abort(404, 'Assigned dish does not belong to this menu.');
        }

        $validated = $request->validate([
            'meals_covered' => ['sometimes', 'integer', 'min:1', 'max:3'],
            'meal_type' => ['sometimes', 'string', Rule::in(['breakfast', 'lunch', 'dinner'])],
        ]);

        $assignedDish->fill($validated);
        $assignedDish->save();

        $menu->load('assignedDishes.dish');

        return response()->json(new WeeklyMenuResource($menu));
    }

    /**
     * DELETE /api/chef/weekly-menus/{menu}/dishes/{assignedDish}.
     */
    public function destroy(WeeklyMenu $menu, WeeklyMenuDish $assignedDish): JsonResponse
    {
        $this->authorize('delete', $assignedDish);

        if ((int) $assignedDish->weekly_menu_id !== (int) $menu->id) {
            abort(404, 'Assigned dish does not belong to this menu.');
        }

        $assignedDish->delete();

        $menu->load('assignedDishes.dish');

        return response()->json(new WeeklyMenuResource($menu));
    }
}
