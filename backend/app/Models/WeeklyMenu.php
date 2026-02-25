<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class WeeklyMenu extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'chef_profile_id',
        'title',
        'description',
        'duration_days',
        'menu_scope',
        'required_meal_count',
        'base_price',
        'status',
        'is_default',
        'metadata',
        'is_locked',
        'locked_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'duration_days' => 'integer',
            'required_meal_count' => 'integer',
            'base_price' => 'decimal:2',
            'metadata' => 'array',
            'is_default' => 'boolean',
            'is_locked' => 'boolean',
            'locked_at' => 'datetime',
        ];
    }

    /**
     * Get the dish entries that belong to this weekly menu.
     */
    public function weeklyMenuDishes()
    {
        return $this->hasMany(WeeklyMenuDish::class);
    }

    /**
     * Boot the model and enforce domain constraints.
     */
    protected static function booted(): void
    {
        static::saving(function (self $menu): void {
            // Locked menus are immutable – clone instead of editing.
            if ($menu->exists && $menu->getOriginal('is_locked') === true) {
                if ($menu->isDirty()) {
                    throw new \RuntimeException('Locked weekly menus cannot be modified. Clone the menu to make changes.');
                }
            }

            // Enforce valid duration (5 or 7 days).
            $durationDays = (int) $menu->duration_days;
            if (! in_array($durationDays, [5, 7], true)) {
                throw new \InvalidArgumentException('duration_days must be either 5 or 7.');
            }

            // Calculate required_meal_count from duration and scope.
            $scope = $menu->menu_scope ?? 'full';
            $mealsPerDay = match ($scope) {
                'full' => 3,
                'breakfast_only',
                'lunch_only',
                'dinner_only' => 1,
                default => throw new \InvalidArgumentException('Invalid menu_scope value.'),
            };

            $menu->required_meal_count = $durationDays * $mealsPerDay;

            // When locking a menu for the first time, set locked_at.
            if ($menu->isDirty('is_locked') && $menu->is_locked && $menu->locked_at === null) {
                $menu->locked_at = Carbon::now();
            }

            // For full-scope menus that are being published, require at least one dish per meal type.
            if ($menu->status === 'published' && $scope === 'full') {
                $requiredTypes = ['breakfast', 'lunch', 'dinner'];

                $typeCounts = $menu->weeklyMenuDishes()
                    ->whereIn('meal_type', $requiredTypes)
                    ->selectRaw('meal_type, COUNT(*) as count')
                    ->groupBy('meal_type')
                    ->pluck('count', 'meal_type')
                    ->toArray();

                foreach ($requiredTypes as $type) {
                    if (! isset($typeCounts[$type]) || $typeCounts[$type] < 1) {
                        throw new \RuntimeException('Full-scope menus must include at least one dish for each of breakfast, lunch, and dinner.');
                    }
                }
            }
        });
    }
}

