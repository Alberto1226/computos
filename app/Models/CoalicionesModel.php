<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoalicionesModel extends Model
{
    use HasFactory;

    protected $table = 'coaliciones';
    protected $fillable = [
        'descripcion',
        'id_partidos',
        'id_eleccion',
    ];
}
