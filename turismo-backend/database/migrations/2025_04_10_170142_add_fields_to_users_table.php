<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('country')->nullable();
            $table->string('birth_date')->nullable();
            $table->string('address')->nullable();
            $table->string('gender')->nullable();
            $table->string('phone')->nullable();
            $table->string('preferred_language')->nullable();
            $table->boolean('active')->default(true);
            $table->boolean('last_login')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
