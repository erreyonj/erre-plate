<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
        
            // Who is ordering
            $table->foreignId('customer_id')
                ->constrained('users')
                ->cascadeOnDelete();
        
            // Which chef fulfills it
            $table->foreignId('chef_profile_id')
                ->constrained('chef_profiles')
                ->cascadeOnDelete();
        
            // Which menu bundle was purchased
            $table->foreignId('weekly_menu_id')
                ->constrained('weekly_menus')
                ->restrictOnDelete();
        
            // Order workflow (8-state from project spec)
            $table->enum('status', [
                'pending',
                'accepted',
                'shopping',
                'preparing',
                'ready',
                'delivered',
                'completed',
                'cancelled'
            ])->default('pending');
        
            // Pricing snapshot
            $table->decimal('bundle_price', 10, 2);
            // V2 credit system to be integrated
            // $table->decimal('credit_used', 10, 2)->default(0);
            $table->decimal('cash_paid', 10, 2)->default(0);
        
            // Delivery info
            $table->jsonb('delivery_address');
        
            // Optional: snapshot of menu at time of order
            $table->jsonb('menu_snapshot')->nullable();
        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
