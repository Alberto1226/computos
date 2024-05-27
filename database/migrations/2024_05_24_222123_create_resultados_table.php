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
        Schema::create('resultados', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('id_casilla')->nullable();
            $table->unsignedBigInteger('id_partido')->nullable();
            $table->unsignedBigInteger('id_coalicion')->nullable();
            $table->unsignedBigInteger('id_eleccion')->nullable();
            $table->bigInteger('total')->nullable();
            $table->unsignedBigInteger('id_user');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resultados');
    }
};
