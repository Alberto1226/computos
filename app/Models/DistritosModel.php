<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DistritosModel extends Model
{
    use HasFactory;

    protected $table = 'distrito';
    protected $fillable = [
        'descripcion',
        'votosTotales',
        'avanceVotos',
        'id_user',
    ];

}
