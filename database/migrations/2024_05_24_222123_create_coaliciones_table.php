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
        Schema::create('coaliciones', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('descripcion');
            $table->string('id_partidos', 100)->nullable();
            $table->unsignedBigInteger('id_eleccion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coaliciones');
    }
};
