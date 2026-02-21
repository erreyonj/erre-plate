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
        Schema::create('chef_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chef_profile_id')->constrained('chef_profiles');
            $table->unsignedTinyInteger('day_of_week'); // 0-6 (Sunday-Saturday) or 1-7
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chef_availability');
    }
};
