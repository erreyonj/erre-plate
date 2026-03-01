<?php

// app/Models/Order.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'chef_profile_id',
        'customer_id',
        'weekly_menu_id',
        'total_price',
        'status',
        'delivery_date',
    ];

    protected function casts(): array
    {
        return [
            'total_price' => 'decimal:2',
            'delivery_date' => 'datetime',
        ];
    }

    public function chef(): BelongsTo
    {
        return $this->belongsTo(ChefProfile::class, 'chef_profile_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}