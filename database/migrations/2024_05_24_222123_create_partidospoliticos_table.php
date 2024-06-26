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
        Schema::create('partidospoliticos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('nombrePartido');
            $table->text('abrebiatura');
            $table->text('color');
            $table->text('imagen');
            $table->unsignedBigInteger('id_user');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partidospoliticos');
    }
};
