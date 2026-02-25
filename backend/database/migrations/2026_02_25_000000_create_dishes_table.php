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
        Schema::create('dishes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('chef_profile_id')
                ->constrained('chef_profiles')
                ->cascadeOnDelete();

            $table->string('name');
            $table->text('description');
            $table->enum('meal_type', ['breakfast', 'lunch', 'dinner'])
                ->default('dinner');

            $table->unsignedSmallInteger('prep_time_minutes')->nullable();

            $table->jsonb('ingredients')->nullable();
            $table->jsonb('dietary_tags')->nullable();
            $table->jsonb('metadata')->nullable();

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dishes');
    }
};

