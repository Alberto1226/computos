<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\SeccionesModel;

class SeccionesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Secciones/index');
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
            'id_distrito' => 'required|integer',
        ]);

        // Crear una nueva instancia de Seccion con los datos del formulario
        $seccion = new SeccionesModel();
        $seccion->descripcion = $request->descripcion;
        $seccion->id_distrito = $request->id_distrito;

        // Guardar la sección en la base de datos
        $seccion->save();

        // Devolver una respuesta
        return response()->json(['message' => 'Sección creada correctamente'], 200);
    }

    public function listarSecciones()
    {
        // Obtener todas las secciones
        $secciones = SeccionesModel::all();

        // Devolver las secciones como respuesta JSON
        return response()->json($secciones);
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
        // Buscar la sección por su ID
        $seccion = SeccionesModel::findOrFail($id);

        // Validar los datos del formulario
        $request->validate([
            'descripcion' => 'required|string',
            'id_distrito' => 'required|integer',
        ]);

        // Actualizar los datos de la sección
        $seccion->descripcion = $request->descripcion;
        $seccion->id_distrito = $request->id_distrito;

        // Guardar los cambios en la base de datos
        $seccion->save();

        // Devolver una respuesta
        return response()->json(['message' => 'Sección actualizada correctamente'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
