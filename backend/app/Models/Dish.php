<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dish extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'chef_profile_id',
        'name',
        'description',
        'meal_type',
        'prep_time_minutes',
        'ingredients',
        'dietary_tags',
        'metadata',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'ingredients' => 'array',
            'dietary_tags' => 'array',
            'metadata' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the weekly menu dish entries that reference this dish.
     */
    public function weeklyMenuDishes()
    {
        return $this->hasMany(WeeklyMenuDish::class);
    }
}

