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
        
            $table->foreignId('customer_id')
                ->constrained('users')
                ->cascadeOnDelete();
        
            $table->foreignId('chef_profile_id')
                ->constrained('chef_profiles')
                ->cascadeOnDelete();
        
            $table->foreignId('weekly_menu_id')
                ->constrained('weekly_menus')
                ->restrictOnDelete();
        
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
        
            $table->decimal('bundle_price', 10, 2);
            $table->decimal('cash_paid', 10, 2)->default(0);
        
            $table->jsonb('delivery_address');
            $table->jsonb('menu_snapshot')->nullable();
        
            $table->date('delivery_date');
        
            // Optional future-proofing
            // $table->timestamp('cutoff_at')->nullable();
        
            $table->timestamps();
        
            $table->index(['chef_profile_id', 'delivery_date']);
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
