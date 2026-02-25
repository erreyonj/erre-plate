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
        Schema::create('weekly_menus', function (Blueprint $table) {
            $table->id();

            $table->foreignId('chef_profile_id')
                ->constrained('chef_profiles')
                ->cascadeOnDelete();

            $table->string('title');
            $table->text('description')->nullable();

            $table->unsignedTinyInteger('duration_days')->default(7);

            $table->enum('menu_scope', ['full', 'breakfast_only', 'lunch_only', 'dinner_only'])
                ->default('full');

            $table->unsignedSmallInteger('required_meal_count');

            $table->decimal('base_price', 10, 2)->default(0);

            $table->enum('status', ['draft', 'published', 'archived'])
                ->default('draft');

            $table->boolean('is_default')->default(false);

            $table->boolean('is_locked')->default(false);
            $table->timestamp('locked_at')->nullable();

            $table->jsonb('metadata')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weekly_menus');
    }
};

