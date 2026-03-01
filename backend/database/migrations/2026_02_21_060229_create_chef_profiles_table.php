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
        Schema::create('chef_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

                $table->text('bio')->nullable();
                $table->jsonb('specialties')->nullable();
                
                $table->decimal('hourly_rate', 10, 2)->default(0);
                
                $table->integer('max_orders_per_cycle')->default(3);
                
                $table->boolean('is_paused')->default(false);
                
                $table->enum('delivery_day', ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'])->default('Sunday'); 
                // 0 = Sunday, 1 = Monday, etc
                
                $table->enum('cutoff_day', ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'])->default('Thursday');
                // example: 4 = Thursday
                
                $table->time('cutoff_time')->default('12:00:00');
                
                $table->enum('status', ['pending', 'approved', 'suspended'])
                    ->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chef_profiles');
    }
};
