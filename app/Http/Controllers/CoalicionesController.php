<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\CoalicionesModel;
use Illuminate\Support\Facades\Auth;


class CoalicionesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Coaliciones/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar los datos del formulario
        $request->validate([
            'descripcion' => 'required|string',
            'id_partidos' => 'required|string',
            'id_eleccion' => 'required|string',
            
        ]);

        $id = Auth::user()->id;

        // Crear una nueva instancia de Coalicion con los datos del formulario
        $coalicion = new CoalicionesModel();
        $coalicion->descripcion = $request->descripcion;
        $coalicion->id_partidos = $request->id_partidos;
        $coalicion->id_eleccion = $request->id_eleccion;
        $coalicion->id_user = $id;

        // Guardar la coalición en la base de datos
        $coalicion->save();

        // Devolver una respuesta
        return response()->json(['message' => 'Coalición creada correctamente'], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $coalicion = CoalicionesModel::find($id);

        $coalicion->descripcion = $request->descripcion;
        $coalicion->id_partidos = $request->id_partidos;
        $coalicion->id_eleccion = $request->id_eleccion;

        $coalicion->save();

        return response()->json(['message' => 'Coalición actualizada correctamente'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $coalicion = CoalicionesModel::find($id);

        $coalicion->delete();

        return response()->json(['message' => 'Coalición eliminada correctamente'], 200);
    }

    public function listarCoaliciones()
    {
        $coaliciones = CoalicionesModel::all();
        return response()->json($coaliciones);
    }

    public function listarCoalicionesPartidos($id_eleccion)
{
    $coaliciones = DB::table('coaliciones')
        ->leftJoin('partidospoliticos', function ($join) {
            $join->on(DB::raw('FIND_IN_SET(partidospoliticos.id, coaliciones.id_partidos)'), '>', DB::raw('0'));
        })
        ->where('id_eleccion', $id_eleccion)
        ->select('coaliciones.id', 'coaliciones.descripcion', 'coaliciones.id_partidos', 'coaliciones.id_eleccion',
                DB::raw('GROUP_CONCAT(partidospoliticos.abrebiatura) as abreviaturas'),
                DB::raw('GROUP_CONCAT(partidospoliticos.color) as colores'))
        ->groupBy('coaliciones.id', 'coaliciones.descripcion', 'coaliciones.id_partidos', 'coaliciones.id_eleccion')
        ->get();

    return response()->json($coaliciones);
}


}
