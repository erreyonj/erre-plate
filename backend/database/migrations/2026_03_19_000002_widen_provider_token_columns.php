<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE users ALTER COLUMN provider_token TYPE text");
            DB::statement("ALTER TABLE users ALTER COLUMN provider_refresh_token TYPE text");
            return;
        }

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY provider_token TEXT NULL");
            DB::statement("ALTER TABLE users MODIFY provider_refresh_token TEXT NULL");
            return;
        }

        // Fallback
        DB::statement("ALTER TABLE users ALTER COLUMN provider_token TYPE text");
        DB::statement("ALTER TABLE users ALTER COLUMN provider_refresh_token TYPE text");
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE users ALTER COLUMN provider_token TYPE varchar(255)");
            DB::statement("ALTER TABLE users ALTER COLUMN provider_refresh_token TYPE varchar(255)");
            return;
        }

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY provider_token VARCHAR(255) NULL");
            DB::statement("ALTER TABLE users MODIFY provider_refresh_token VARCHAR(255) NULL");
            return;
        }

        DB::statement("ALTER TABLE users ALTER COLUMN provider_token TYPE varchar(255)");
        DB::statement("ALTER TABLE users ALTER COLUMN provider_refresh_token TYPE varchar(255)");
    }
};

