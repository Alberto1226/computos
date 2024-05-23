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
        Schema::create('casilla', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('id_seccion');
            $table->text('tipoCasilla')->nullable();
            $table->bigInteger('listaNominal')->nullable();
            $table->bigInteger('votosNulos')->nullable();
            $table->bigInteger('votosTotales')->nullable();
            $table->text('ubicacion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('casilla');
    }
};
