<?php

namespace App\Http\Controllers;

use App\Models\PartidosPoliticosModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class PartidosPoliticosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('PartidosPoliticos/index');
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
            'nombre' => 'required|string',
            'abreviatura' => 'required|string',
            'color' => 'required|string',

        ]);

        $id = Auth::user()->id;
        // Crear una nueva instancia de PartidoPolitico con los datos del formulario
        $partido = new PartidosPoliticosModel();
        $partido->nombrePartido = $request->nombre;
        $partido->abrebiatura = $request->abreviatura;
        $partido->color = $request->color;
        $partido->id_user = $id;

        if ($request->hasFile('imagen')) {
            $imagen = $request->file('imagen');
            $nombreImagen = time() . '.' . $imagen->getClientOriginalExtension();
            $destinoPath = storage_path('app/public'); // Cambiado aquí
            $imagen->move($destinoPath, $nombreImagen);
            $partido->imagen = $nombreImagen; // Guardar el nombre de la imagen en la base de datos
        }

        // Guardar el partido en la base de datos
        $partido->save();

        // Devolver una respuesta
        return response()->json(['message' => 'Partido político creado correctamente'], 200);
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
        $partido = PartidosPoliticosModel::findOrFail($id);

        // Validar los datos del formulario
        $request->validate([
            'nombre' => 'required|string',
            'abreviatura' => 'required|string',
            'color' => 'required|string',
            'imagen' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validación para el archivo de imagen
        ]);

        $partido->nombrePartido = $request->nombre;
        $partido->abrebiatura = $request->abreviatura;
        $partido->color = $request->color;

        // Actualizar la imagen si se proporcionó una nueva
        if ($request->hasFile('imagen')) {
            $imagen = $request->file('imagen');
            $nombreImagen = time() . '.' . $imagen->getClientOriginalExtension();
            $destinoPath = storage_path('app/public'); // Cambiado aquí
            $imagen->move($destinoPath, $nombreImagen);
            $partido->imagen = $nombreImagen; // Actualizar el nombre de la imagen en la base de datos
        }

        $partido->save();

        return response()->json(['message' => 'Partido Politico actualizado correctamente'], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $partido = PartidosPoliticosModel::findOrFail($id);

        $partido->delete();

        return response()->json(['message' => 'Partido Politico Eliminado Correctamente'], Response::HTTP_OK);
    }

    public function listarPartidos()
    {
        // Obtener todos los partidos políticos
        $partidos = PartidosPoliticosModel::all();

        // Devolver los partidos políticos como respuesta JSON
        return response()->json($partidos);
    }
}
