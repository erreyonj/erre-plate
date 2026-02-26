<?php

namespace App\Http\Controllers\Chef;

use App\Http\Controllers\Controller;
use App\Http\Resources\WeeklyMenuIndexResource;
use App\Http\Resources\WeeklyMenuResource;
use App\Models\WeeklyMenu;
use App\Services\WeeklyMenuService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class WeeklyMenuController extends Controller
{
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
     * GET /api/chef/weekly-menus — lightweight list.
     */
    public function index(): JsonResponse
    {
        $chefId = $this->chefProfileId();
        $menus = WeeklyMenu::query()
            ->where('chef_profile_id', $chefId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(WeeklyMenuIndexResource::collection($menus));
    }

    /**
     * POST /api/chef/weekly-menus — create draft.
     */
    public function store(Request $request): JsonResponse
    {
        $chefId = $this->chefProfileId();

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'duration_days' => ['integer', Rule::in([5, 7])],
            'menu_scope' => ['string', Rule::in(['full', 'breakfast_only', 'lunch_only', 'dinner_only'])],
            'base_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        $duration = (int) ($validated['duration_days'] ?? 7);
        $scope = $validated['menu_scope'] ?? 'full';
        $required = WeeklyMenuService::calculateRequiredMealCount($duration, $scope);

        $menu = new WeeklyMenu([
            'chef_profile_id' => $chefId,
            'title' => $validated['title'] ?? 'Untitled weekly menu',
            'description' => $validated['description'] ?? null,
            'duration_days' => $duration,
            'menu_scope' => $scope,
            'required_meal_count' => $required,
            'base_price' => $validated['base_price'] ?? 0,
            'status' => 'draft',
        ]);
        $menu->save();

        $menu->load('assignedDishes.dish');

        return response()->json(new WeeklyMenuResource($menu), 201);
    }

    /**
     * GET /api/chef/weekly-menus/{menu} — full builder payload.
     */
    public function show(WeeklyMenu $menu): JsonResponse
    {
        $this->authorize('view', $menu);

        $menu->load('assignedDishes.dish');

        return response()->json(new WeeklyMenuResource($menu));
    }

    /**
     * PATCH /api/chef/weekly-menus/{menu} — update (draft only); recalc required_meal_count; optional assigned_dishes sync.
     */
    public function update(Request $request, WeeklyMenu $menu): JsonResponse
    {
        $this->authorize('update', $menu);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'duration_days' => ['sometimes', 'integer', Rule::in([5, 7])],
            'menu_scope' => ['sometimes', 'string', Rule::in(['full', 'breakfast_only', 'lunch_only', 'dinner_only'])],
            'base_price' => ['sometimes', 'numeric', 'min:0'],
            'assigned_dishes' => ['sometimes', 'array'],
            'assigned_dishes.*.id' => ['nullable', 'integer'],
            'assigned_dishes.*.dish_id' => ['required_with:assigned_dishes', 'integer', 'exists:dishes,id'],
            'assigned_dishes.*.meals_covered' => ['required_with:assigned_dishes', 'integer', 'min:1', 'max:3'],
            'assigned_dishes.*.meal_type' => ['required_with:assigned_dishes', 'string', Rule::in(['breakfast', 'lunch', 'dinner'])],
        ]);

        $duration = isset($validated['duration_days']) ? (int) $validated['duration_days'] : (int) $menu->duration_days;
        $scope = $validated['menu_scope'] ?? $menu->menu_scope;
        $menu->required_meal_count = WeeklyMenuService::calculateRequiredMealCount($duration, $scope);

        $fillable = array_diff_key($validated, array_flip(['assigned_dishes']));
        $menu->fill($fillable);
        $menu->save();

        if (array_key_exists('assigned_dishes', $validated)) {
            $this->syncAssignedDishes($menu, $validated['assigned_dishes']);
        }

        $menu->load('assignedDishes.dish');

        return response()->json(new WeeklyMenuResource($menu));
    }

    /**
     * Sync assigned dishes: update existing by id, create new when id null/missing, remove not in list. Dish must belong to chef.
     *
     * @param  array<int, array{id?: int|null, dish_id: int, meals_covered: int, meal_type: string}>  $items
     */
    private function syncAssignedDishes(WeeklyMenu $menu, array $items): void
    {
        $chefId = $this->chefProfileId();
        $existingById = $menu->assignedDishes()->get()->keyBy('id');
        $seenIds = [];

        foreach ($items as $item) {
            $dish = \App\Models\Dish::find($item['dish_id']);
            if (! $dish || (int) $dish->chef_profile_id !== $chefId) {
                continue;
            }

            $id = isset($item['id']) ? (int) $item['id'] : null;
            $mealsCovered = (int) $item['meals_covered'];
            $mealType = $item['meal_type'];

            if ($id && $existingById->has($id)) {
                $entry = $existingById->get($id);
                $entry->fill(['meals_covered' => $mealsCovered, 'meal_type' => $mealType]);
                $entry->save();
                $seenIds[] = $entry->id;
            } else {
                $entry = $menu->assignedDishes()->create([
                    'dish_id' => $dish->id,
                    'meals_covered' => $mealsCovered,
                    'meal_type' => $mealType,
                ]);
                $seenIds[] = $entry->id;
            }
        }

        $menu->assignedDishes()->whereNotIn('id', $seenIds)->delete();
    }

    /**
     * PATCH /api/chef/weekly-menus/{menu}/publish — validate then publish.
     */
    public function publish(WeeklyMenu $menu): JsonResponse
    {
        $this->authorize('publish', $menu);

        $errors = $this->validatePublish($menu);
        if (! empty($errors)) {
            throw ValidationException::withMessages(['publish' => $errors]);
        }

        $menu->status = 'published';
        $menu->save();

        $menu->load('assignedDishes.dish');

        return response()->json(new WeeklyMenuResource($menu));
    }

    /**
     * PATCH /api/chef/weekly-menus/{menu}/archive.
     */
    public function archive(WeeklyMenu $menu): JsonResponse
    {
        $this->authorize('archive', $menu);

        $menu->status = 'archived';
        $menu->save();

        $menu->load('assignedDishes.dish');

        return response()->json(new WeeklyMenuResource($menu));
    }

    /**
     * Validate publish rules; return list of error messages for 422.
     *
     * @return array<int, string>
     */
    private function validatePublish(WeeklyMenu $menu): array
    {
        $errors = [];

        $totalRequired = (int) $menu->required_meal_count;
        $assigned = $menu->assignedDishes()->get();
        $totalAssigned = $assigned->sum('meals_covered');

        if ($totalAssigned !== $totalRequired) {
            $errors[] = "Total assigned meals ({$totalAssigned}) must equal required meal count ({$totalRequired}).";
        }

        if ($menu->menu_scope === 'full') {
            $breakfast = $assigned->where('meal_type', 'breakfast')->sum('meals_covered');
            $lunch = $assigned->where('meal_type', 'lunch')->sum('meals_covered');
            $dinner = $assigned->where('meal_type', 'dinner')->sum('meals_covered');

            if ($breakfast < 1) {
                $errors[] = 'Full-scope menus must have at least one breakfast meal.';
            }
            if ($lunch < 1) {
                $errors[] = 'Full-scope menus must have at least one lunch meal.';
            }
            if ($dinner < 1) {
                $errors[] = 'Full-scope menus must have at least one dinner meal.';
            }
        }

        return $errors;
    }
}
