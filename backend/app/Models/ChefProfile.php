<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChefProfile extends Model
{
    protected $table = 'chef_profiles';

    protected $fillable = [
        'user_id',
        'bio',
        'specialties',
        'hourly_rate',
        'rating_average',
        'rating_count',
        'max_orders_per_week',
        'availability',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'specialties' => 'array',
            'availability' => 'array',
            'hourly_rate' => 'decimal:2',
            'rating_average' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function weeklyMenus(): HasMany
    {
        return $this->hasMany(WeeklyMenu::class, 'chef_profile_id');
    }

    public function dishes(): HasMany
    {
        return $this->hasMany(Dish::class, 'chef_profile_id');
    }
}
