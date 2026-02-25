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
        Schema::create('weekly_menu_dishes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('weekly_menu_id')
                ->constrained('weekly_menus')
                ->cascadeOnDelete();

            $table->foreignId('dish_id')
                ->constrained('dishes')
                ->cascadeOnDelete();

            $table->unsignedTinyInteger('meals_covered')->default(1);

            $table->enum('meal_type', ['breakfast', 'lunch', 'dinner'])
                ->default('dinner');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weekly_menu_dishes');
    }
};

