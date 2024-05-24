<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResultadosModel extends Model
{
    use HasFactory;

    protected $table = 'resultados';
    protected $fillable = [
        'id_casilla',
        'id_partido',
        'id_coalicion',
        'id_eleccion',
        'total',
    ];
}
