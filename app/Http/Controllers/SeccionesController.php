<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\SeccionesModel;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;
use Illuminate\Support\Facades\Auth;


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
            'listaNominal' => 'required|integer',
        ]);

        // Crear una nueva instancia de Seccion con los datos del formulario
        $seccion = new SeccionesModel();
        $seccion->descripcion = $request->descripcion;
        $seccion->id_distrito = $request->id_distrito;
        $seccion->listaNominal = $request->listaNominal;

        // Guardar la sección en la base de datos
        $seccion->save();

        // Devolver una respuesta
        return response()->json(['message' => 'Sección creada correctamente'], 200);
    }

    public function storeFromCSV(Request $request)
    {
        // Validar los datos del formulario
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048', 
        ]);

      

        // Obtener el archivo CSV del formulario
        $csvFile = $request->file('csv_file');

        // Abrir el archivo CSV y leer su contenido
        $csvReader = Reader::createFromPath($csvFile->getPathname(), 'r');
        $csvReader->setHeaderOffset(0); 
        $csvReader->setDelimiter(','); 

        // Iterar sobre cada fila del archivo CSV y crear una sección para cada una
        foreach ($csvReader as $row) {
            $seccion = new SeccionesModel();
            $seccion->descripcion = $row['descripcion'];
            $seccion->id_distrito = $row['distrito'];
            $seccion->listaNominal = $row['listaNominal'];

            // Guardar la sección en la base de datos
            $seccion->save();
        }

        // Devolver una respuesta
        return response()->json(['message' => 'Secciones cargadas correctamente desde el archivo CSV!'], 200);
    }


    public function listarSecciones()
    {
        // Obtener todas las secciones
        $seccionesConDistrito = DB::table('secciones')
            ->join('distrito', 'secciones.id_distrito', '=', 'distrito.id')
            ->select('secciones.id', 'secciones.descripcion', 'secciones.listaNominal', 'secciones.created_at', 'secciones.updated_at', 'distrito.descripcion as distrito')
            ->get();

        // Devolver las secciones como respuesta JSON
        return response()->json($seccionesConDistrito);
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
            'listaNominal' => 'required|int',
        ]);

        // Actualizar los datos de la sección
        $seccion->descripcion = $request->descripcion;
        $seccion->id_distrito = $request->id_distrito;
        $seccion->listaNominal = $request->listaNominal;

        // Guardar los cambios en la base de datos
        $seccion->save();

        // Devolver una respuesta
        return response()->json(['message' => 'Sección actualizada correctamente'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Buscar la instancia de la unidad de medida que se desea eliminar
        $unidadMedida = SeccionesModel::findOrFail($id);

        // Eliminar la unidad de medida de la base de datos
        $unidadMedida->delete();

        // Redireccionar a una página de éxito o enviar una respuesta JSON
        // En este caso, simplemente devolvemos una respuesta JSON indicando que se ha eliminado correctamente
        return response()->json(['message' => 'Seccion eliminada correctamente'], Response::HTTP_OK);
    }
}
