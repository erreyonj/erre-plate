<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\OrderMenu;
use App\Models\OrderStatusEvent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'chef_profile_id',
        'status',
        'subtotal',
        'platform_fee',
        'tax',
        'total',
        'currency',
        'delivery_date',
        'delivery_address',
        'notes',
        'placed_at',
        'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal'         => 'decimal:2',
            'platform_fee'     => 'decimal:2',
            'tax'              => 'decimal:2',
            'total'            => 'decimal:2',
            'delivery_address' => 'array',
            'delivery_date'    => 'date:Y-m-d',
            'placed_at'        => 'datetime',
            'cancelled_at'     => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function chef(): BelongsTo
    {
        return $this->belongsTo(ChefProfile::class, 'chef_profile_id');
    }

    public function orderMenu(): HasOne
    {
        return $this->hasOne(OrderMenu::class);
    }

    public function statusEvents(): HasMany
    {
        return $this->hasMany(OrderStatusEvent::class)->orderBy('created_at');
    }
}
