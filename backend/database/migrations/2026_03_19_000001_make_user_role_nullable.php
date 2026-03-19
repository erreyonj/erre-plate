<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE users ALTER COLUMN role DROP DEFAULT");
            DB::statement("ALTER TABLE users ALTER COLUMN role DROP NOT NULL");
            return;
        }

        if ($driver === 'mysql') {
            // Laravel's enum is stored as an actual ENUM in MySQL.
            DB::statement("ALTER TABLE users MODIFY role ENUM('customer','chef','admin') NULL DEFAULT NULL");
            return;
        }

        // Fallback: try standard SQL
        DB::statement("ALTER TABLE users ALTER COLUMN role DROP DEFAULT");
        DB::statement("ALTER TABLE users ALTER COLUMN role DROP NOT NULL");
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("UPDATE users SET role = 'customer' WHERE role IS NULL");
            DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'customer'");
            DB::statement("ALTER TABLE users ALTER COLUMN role SET NOT NULL");
            return;
        }

        if ($driver === 'mysql') {
            DB::statement("UPDATE users SET role = 'customer' WHERE role IS NULL");
            DB::statement("ALTER TABLE users MODIFY role ENUM('customer','chef','admin') NOT NULL DEFAULT 'customer'");
            return;
        }

        DB::statement("UPDATE users SET role = 'customer' WHERE role IS NULL");
        DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'customer'");
        DB::statement("ALTER TABLE users ALTER COLUMN role SET NOT NULL");
    }
};

