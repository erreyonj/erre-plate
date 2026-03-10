<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop old stub tables (order dependent first)
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');

        // ---------------------------------------------------------------
        // orders
        // ---------------------------------------------------------------
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('chef_profile_id')
                ->constrained('chef_profiles')
                ->cascadeOnDelete();

            $table->enum('status', [
                'pending',
                'confirmed',
                'preparing',
                'ready',
                'completed',
                'cancelled',
            ])->default('pending');

            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('platform_fee', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);

            $table->string('currency', 3)->default('USD');

            $table->date('delivery_date')->nullable();
            $table->jsonb('delivery_address')->nullable();
            $table->text('notes')->nullable();

            $table->timestamp('placed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();

            $table->timestamps();

            $table->index(['chef_profile_id', 'status']);
        });

        // ---------------------------------------------------------------
        // order_menus  — snapshot of the WeeklyMenu at order time
        // ---------------------------------------------------------------
        Schema::create('order_menus', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->constrained('orders')
                ->cascadeOnDelete();

            // Nullable so history is preserved if the source menu is deleted
            $table->foreignId('weekly_menu_id')
                ->nullable()
                ->constrained('weekly_menus')
                ->nullOnDelete();

            $table->string('menu_name');
            $table->text('menu_description')->nullable();
            $table->decimal('price', 10, 2)->default(0);

            $table->timestamp('created_at')->useCurrent();
        });

        // ---------------------------------------------------------------
        // order_menu_items  — snapshot of each dish inside the ordered menu
        // ---------------------------------------------------------------
        Schema::create('order_menu_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_menu_id')
                ->constrained('order_menus')
                ->cascadeOnDelete();

            // Nullable so history is preserved if the source dish is deleted
            $table->foreignId('dish_id')
                ->nullable()
                ->constrained('dishes')
                ->nullOnDelete();

            $table->string('dish_name');
            $table->text('dish_description')->nullable();
            $table->smallInteger('sort_order')->default(0);

            $table->timestamp('created_at')->useCurrent();
        });

        // ---------------------------------------------------------------
        // order_status_events  — full lifecycle audit trail
        // ---------------------------------------------------------------
        Schema::create('order_status_events', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->constrained('orders')
                ->cascadeOnDelete();

            $table->enum('status', [
                'pending',
                'confirmed',
                'preparing',
                'ready',
                'completed',
                'cancelled',
            ]);

            $table->text('note')->nullable();

            // Who triggered this event (nullable — system events have no actor)
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_status_events');
        Schema::dropIfExists('order_menu_items');
        Schema::dropIfExists('order_menus');
        Schema::dropIfExists('orders');

        // Recreate reviews pointing to the restored orders table
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->foreignId('user_id')->constrained('users');
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }
};
