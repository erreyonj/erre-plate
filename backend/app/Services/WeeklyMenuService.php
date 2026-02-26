<?php

namespace App\Services;

/**
 * Business logic for weekly menu meal counts.
 * Do not trust frontend calculations — use this as single source of truth.
 */
final class WeeklyMenuService
{
    /**
     * Calculate required meal count from duration and scope.
     *
     * @param  int  $duration  Number of days (5 or 7).
     * @param  string  $scope  One of: full, breakfast_only, lunch_only, dinner_only.
     * @return int
     */
    public static function calculateRequiredMealCount(int $duration, string $scope): int
    {
        if (! in_array($duration, [5, 7], true)) {
            throw new \InvalidArgumentException('Duration must be 5 or 7.');
        }

        $mealsPerDay = match ($scope) {
            'full' => 3,
            'breakfast_only', 'lunch_only', 'dinner_only' => 1,
            default => throw new \InvalidArgumentException('Invalid menu_scope.'),
        };

        return $duration * $mealsPerDay;
    }
}
