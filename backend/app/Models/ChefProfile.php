<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Services\ChefAvailabilityService;

class ChefProfile extends Model
{
    protected $table = 'chef_profiles';

    protected $appends = ['is_available'];

    protected $fillable = [
        'bio',
        'slug',
        'tagline',
        'specialties',
        'credit_balance',
        'hourly_rate',
        'max_orders_per_cycle',
        'is_paused',
        'delivery_day',
        'cutoff_day',
        'cutoff_time',
        'neighborhood_id',
    ];

    public function getIsAvailableAttribute(): bool
    {
        return app(ChefAvailabilityService::class)
            ->isChefAvailable($this);
    }

    protected function casts(): array
    {
        return [
            'tagline' => 'string',
            'specialties' => 'array',
            'hourly_rate' => 'decimal:2',
            'credit_balance' => 'decimal:2',
            'rating_average' => 'decimal:2',
            'is_paused' => 'boolean',
            'delivery_day' => 'integer',
            'cutoff_day' => 'integer',
            'cutoff_time' => 'datetime:H:i',
            'neighborhood_id' => 'integer',
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

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'chef_profile_id');
    }

    public function neighborhood()
    {
        return $this->belongsTo(Neighborhood::class, 'neighborhood_id');
    }
}