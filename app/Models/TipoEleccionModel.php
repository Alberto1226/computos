<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoEleccionModel extends Model
{
    use HasFactory;
    protected $table = 'tipoeleccion';
    protected $fillable = [
        'nombreEleccion',
    ];
}
