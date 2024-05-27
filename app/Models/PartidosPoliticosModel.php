<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartidosPoliticosModel extends Model
{
    use HasFactory;

    protected $table = 'partidospoliticos';
    protected $fillable = [
        'nombrePartido',
        'abrebiatura',
        'color',
        'id_user',
    ];
}
