<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DistritosModel;
use Illuminate\Http\Response;

class DitritosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Distritos/index');
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
            // Validar los datos de la solicitud
            $request->validate([
                'nombre' => 'required|string',
            ]);
            // Crear una nueva instancia de DivisionesDepartamentos y asignar los valores de la solicitud
            $distrito = new DistritosModel();
            $distrito->descripcion = $request->nombre;
            // Guardar el registro en la base de datos
            $distrito->save();
            // Retornar una respuesta adecuada
            return redirect()->route('Distritos.Distritos.index')->with('success', 'Registro exitoso');
    }

    
    public function listarDistritos()
    {
        $resultados = DistritosModel::get();
        return response()->json($resultados);
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
    public function update(Request $request, $id)
    {
        // Validar los datos de la solicitud utilizando reglas de validación
        $request->validate([
            'descripcion' => 'required|string', 
        ]);

        $des = DistritosModel::findOrFail($id);
        $des->descripcion = $request->descripcion; 
        $des->save();
        // Otra opción: si estás construyendo una API y deseas devolver una respuesta JSON, puedes usar esto en su lugar
         return response()->json(['message' => 'Distrito actualizado con éxito'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $dis = DistritosModel::findOrFail($id);

        // Eliminar la unidad de medida de la base de datos
        $dis->delete();

        return response()->json(['message' => 'Eliminación correctamente'], Response::HTTP_OK);
    }
}
