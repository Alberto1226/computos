<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CasillasModel;

class CasillasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Casillas/index');
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
            'id_seccion' => 'required|int',
            'tipoCasilla' => 'required|string',
            'listaNominal' => 'required|int',
            'votosNulos' => 'required|int',
            'votosTotales' => 'required|int',
            'ubicacion' => 'required|string',
        ]);

        // Crear una nueva instancia de Casilla con los datos del formulario
        $casilla = new CasillasModel();
        $casilla->id_seccion = $request->id_seccion;
        $casilla->tipoCasilla = $request->tipoCasilla;
        $casilla->listaNominal = $request->listaNominal;
        $casilla->votosNulos = $request->votosNulos;
        $casilla->votosTotales = $request->votosTotales;
        $casilla->ubicacion = $request->ubicacion;

        // Guardar la casilla en la base de datos
        $casilla->save();

        // Devolver una respuesta
        return response()->json(['message' => 'Casilla creada correctamente'], 200);
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

        $request->validate([
            'id_seccion' => 'required|int',
            'tipoCasilla' => 'required|string',
            'listaNominal' => 'required|int',
            'votosNulos' => 'required|int',
            'votosTotales' => 'required|int',
            'ubicacion' => 'required|string',
        ]);

        $casilla = CasillasModel::find($id);

        $casilla->id_seccion = $request->id_seccion;
        $casilla->tipoCasilla = $request->tipoCasilla;
        $casilla->listaNominal = $request->listaNominal;
        $casilla->votosNulos = $request->votosNulos;
        $casilla->votosTotales = $request->votosTotales;
        $casilla->ubicacion = $request->ubicacion;

        $casilla->save();

        return response()->json(['message' => 'Casilla actualizada correctamente'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $casilla = CasillasModel::find($id);

        $casilla->delete();

        return response()->json(['message' => 'Casilla eliminada correctamente'], 200);
    }

    public function listarCasillas()
    {
        $casillas = CasillasModel::all();
        return response()->json($casillas);
    }
}
