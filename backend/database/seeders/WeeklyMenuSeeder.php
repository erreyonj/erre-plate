<?php

namespace Database\Seeders;

use App\Models\ChefProfile;
use App\Models\WeeklyMenu;
use App\Models\WeeklyMenuDish;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Services\WeeklyMenuService;

class WeeklyMenuSeeder extends Seeder
{
    private const SCOPES = ['full', 'breakfast_only', 'lunch_only', 'dinner_only'];

    private const MENU_POOL = [
        'full' => [
            ['title' => "Chef's Weekly Table",       'description' => 'A full week of breakfast, lunch, and dinner crafted by your chef.'],
            ['title' => 'All-Day Meal Plan',          'description' => 'Three meals a day, five or seven days a week — fully covered.'],
            ['title' => 'Complete Weekly Spread',     'description' => 'Every meal handled so you can focus on everything else.'],
            ['title' => 'Total Nourish Package',      'description' => 'Balanced breakfast, lunch, and dinner for the whole week.'],
            ['title' => 'Full Plate Weekly',           'description' => 'Morning to evening meals planned and prepped for you.'],
        ],
        'breakfast_only' => [
            ['title' => 'Morning Fuel',               'description' => 'Start each day with a chef-prepared breakfast.'],
            ['title' => 'Weekday Breakfast Boost',    'description' => 'Five mornings of delicious, energising breakfasts.'],
            ['title' => 'Sunrise Menu',                'description' => 'A curated breakfast rotation to kick off your mornings.'],
            ['title' => 'Early Riser Pack',            'description' => 'Quick and hearty breakfasts ready when you wake up.'],
            ['title' => 'AM Essentials',               'description' => 'Simple, satisfying morning meals for the week.'],
        ],
        'lunch_only' => [
            ['title' => 'Clean Lunch Rotation',       'description' => 'Fresh, balanced lunches to power through your afternoons.'],
            ['title' => 'Midday Refuel',               'description' => 'Healthy lunch options to keep your energy steady.'],
            ['title' => 'Lunch Break Menu',            'description' => 'No more sad desk lunches — chef-made meals delivered.'],
            ['title' => 'Noon Nourish',                'description' => 'Wholesome midday meals prepared with care.'],
            ['title' => 'Power Lunch Pack',            'description' => 'Protein-forward lunches to fuel your busy week.'],
        ],
        'dinner_only' => [
            ['title' => 'Family Dinner Pack',         'description' => 'Hearty dinners the whole family will love.'],
            ['title' => 'Evening Comfort Menu',        'description' => 'Warm, satisfying dinners to wind down the day.'],
            ['title' => 'Weeknight Dinner Plan',       'description' => 'Stress-free dinners for every weeknight.'],
            ['title' => 'Supper Selections',           'description' => 'Rotating dinner options from your personal chef.'],
            ['title' => 'After-Hours Kitchen',         'description' => 'Restaurant-quality dinners without leaving home.'],
        ],
    ];

    public function run(): void
    {
        DB::transaction(function () {
            $chefs = ChefProfile::with('dishes')->get();

            foreach ($chefs as $chef) {
                if (rand(1, 100) > 70) {
                    continue;
                }

                $menuCount = rand(2, 4);

                for ($i = 0; $i < $menuCount; $i++) {
                    $scope = self::SCOPES[array_rand(self::SCOPES)];
                    $pool  = self::MENU_POOL[$scope];
                    $pick  = $pool[array_rand($pool)];

                    $menu = WeeklyMenu::create([
                        'chef_profile_id' => $chef->id,
                        'title'           => $pick['title'],
                        'description'     => $pick['description'],
                        'duration_days'   => [5, 7][array_rand([5, 7])],
                        'menu_scope'      => $scope,
                        'required_meal_count' => $scope === 'full' ? 21 : 7,
                        'base_price'      => rand(4500, 15000) / 100,
                        'status'          => 'published',
                    ]);

                    $this->attachDishes($menu, $chef, $scope);
                }
            }
        });
    }

    private function calculateRequiredMealCount(int $duration, string $scope): int
    {
        return WeeklyMenuService::calculateRequiredMealCount($duration, $scope);
        $mealsPerDay = match ($scope) {
            'full' => 3,
            'breakfast_only', 'lunch_only', 'dinner_only' => 1,
            default => throw new \InvalidArgumentException('Invalid menu_scope.'),
        };

        return $duration * $mealsPerDay;
    }

    private function attachDishes(WeeklyMenu $menu, ChefProfile $chef, string $scope): void
    {
        $mealTypes = match ($scope) {
            'breakfast_only' => ['breakfast'],
            'lunch_only'     => ['lunch'],
            'dinner_only'    => ['dinner'],
            default          => ['breakfast', 'lunch', 'dinner'],
        };

        $eligible = $chef->dishes->whereIn('meal_type', $mealTypes)->shuffle();

        if ($eligible->isEmpty()) {
            return;
        }

        $target = min(rand(3, 5), $eligible->count());

        foreach ($eligible->take($target) as $dish) {
            WeeklyMenuDish::create([
                'weekly_menu_id' => $menu->id,
                'dish_id'        => $dish->id,
                'meal_type'      => $dish->meal_type,
                'meals_covered'  => rand(1, 3),
            ]);
        }
    }
}
