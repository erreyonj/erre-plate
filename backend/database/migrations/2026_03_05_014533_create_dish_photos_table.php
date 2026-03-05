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
        Schema::create('dish_photos', function (Blueprint $table) {
            $table->id();
        
            $table->foreignId('dish_id')
                ->constrained('dishes')
                ->cascadeOnDelete();
        
            $table->string('path'); // stored file path
            $table->unsignedSmallInteger('sort_order')->default(0);
        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dish_photos');
    }
};
