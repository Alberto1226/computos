<?php

namespace App\Http\Controllers;

use App\Models\TipoEleccionModel;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class TipoEleccionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Elecciones/index');
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
        $id = Auth::user()->id;

        // Validar los datos de la solicitud
        $request->validate([
            'nombreEleccion' => 'required|string',

        ]);

        // Crear una nueva instancia de DivisionesDepartamentos y asignar los valores de la solicitud
        $eleccion = new TipoEleccionModel();
        $eleccion->nombreEleccion = $request->nombreEleccion;
        $eleccion->id_user = $id;
        // Guardar el registro en la base de datos
        $eleccion->save();
        // Retornar una respuesta adecuada
        return redirect()->route('Elecciones.Elecciones.index')->with('success', 'Registro exitoso');
    }


    public function listarElecciones()
    {
        $resultados = TipoEleccionModel::get();
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
            'nombreEleccion' => 'required|string',
        ]);

        $des = TipoEleccionModel::findOrFail($id);
        $des->nombreEleccion = $request->nombreEleccion;
        $des->save();
        // Otra opción: si estás construyendo una API y deseas devolver una respuesta JSON, puedes usar esto en su lugar
        return response()->json(['message' => 'Tipo Eleccion actualizado con éxito'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $dis = TipoEleccionModel::findOrFail($id);

        // Eliminar la unidad de medida de la base de datos
        $dis->delete();

        return response()->json(['message' => 'Eliminación correctamente'], Response::HTTP_OK);
    }


    public function resetDatabase()
    {
        // Truncar las tablas 'resultados' y 'casilla'
        DB::table('resultados')->truncate();
        DB::table('casilla')->truncate();

        // Actualizar el campo 'avanceVotos' de la tabla 'distrito'
        DB::table('distrito')->update(['avanceVotos' => 0]);

        return response()->json([
            'message' => 'Las tablas han sido truncadas y el avance de votos ha sido reiniciado'
        ]);
    }
}
