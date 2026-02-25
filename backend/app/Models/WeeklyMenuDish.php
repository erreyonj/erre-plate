<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeeklyMenuDish extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'weekly_menu_id',
        'dish_id',
        'meals_covered',
        'meal_type',
    ];

    /**
     * Get the weekly menu this entry belongs to.
     */
    public function weeklyMenu()
    {
        return $this->belongsTo(WeeklyMenu::class);
    }

    /**
     * Get the dish for this weekly menu entry.
     */
    public function dish()
    {
        return $this->belongsTo(Dish::class);
    }

    /**
     * Boot the model and enforce domain constraints.
     */
    protected static function booted(): void
    {
        static::saving(function (self $entry): void {
            $mealsCovered = (int) $entry->meals_covered;

            if ($mealsCovered < 1 || $mealsCovered > 3) {
                throw new \InvalidArgumentException('meals_covered must be between 1 and 3.');
            }

            // Enforce max total meals_covered per dish per weekly menu = 3.
            $query = static::query()
                ->where('weekly_menu_id', $entry->weekly_menu_id)
                ->where('dish_id', $entry->dish_id);

            if ($entry->exists) {
                $query->where('id', '!=', $entry->id);
            }

            $existingTotal = (int) $query->sum('meals_covered');

            if ($existingTotal + $mealsCovered > 3) {
                throw new \RuntimeException('A single dish cannot cover more than 3 meals in a weekly menu.');
            }
        });
    }
}

