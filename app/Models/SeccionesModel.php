<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeccionesModel extends Model
{
    use HasFactory;

    protected $table = 'secciones';
    protected $fillable = [
        'descripcion',
        'id_distrito',
        'listaNominal',
        'id_user',
    ];

}
