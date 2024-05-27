<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CasillasModel extends Model
{
    use HasFactory;

    protected $table = 'casilla';

    protected $fillable = [
        'id_seccion',
        'tipoCasilla',
        'listaNominal',
        'votosNulos',
        'votosTotales',
        'ubicacion',
        'id_user',
    ];
}
