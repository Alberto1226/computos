<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CasillasModel;
use League\Csv\Reader;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


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
            'votosNulos' => 'nullable|int',
            'votosTotales' => 'nullable|int',
            'ubicacion' => 'required|string',

        ]);

        $id = Auth::user()->id;
        // Crear una nueva instancia de Casilla con los datos del formulario
        $casilla = new CasillasModel();
        $casilla->id_seccion = $request->id_seccion;
        $casilla->tipoCasilla = $request->tipoCasilla;
        $casilla->votosNulos = $request->votosNulos;
        $casilla->votosTotales = $request->votosTotales;
        $casilla->ubicacion = $request->ubicacion;
        $casilla->id_user = $id;

        // Guardar la casilla en la base de datos
        $casilla->save();

        // Devolver una respuesta
        return response()->json(['message' => 'Casilla creada correctamente'], 200);
    }

    public function storeFromCSV(Request $request)
    {
        // Validar los datos del formulario
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $id = Auth::user()->id;
        // Obtener el archivo CSV del formulario
        $csvFile = $request->file('csv_file');

        // Abrir el archivo CSV y leer su contenido
        $csvReader = Reader::createFromPath($csvFile->getPathname(), 'r');
        $csvReader->setHeaderOffset(0);
        $csvReader->setDelimiter(',');

        // Iterar sobre cada fila del archivo CSV y crear una casilla para cada una
        foreach ($csvReader as $row) {
            $casilla = new CasillasModel();
            $casilla->id_seccion = (int) $row['id_seccion'];
            $casilla->tipoCasilla = $row['tipoCasilla'];
            $casilla->votosNulos = isset($row['votosNulos']) ? (int) $row['votosNulos'] : null;
            $casilla->votosTotales = isset($row['votosTotales']) ? (int) $row['votosTotales'] : null;
            $casilla->ubicacion = $row['ubicacion'];
            $casilla->id_user = $id;
            // Guardar la casilla en la base de datos
            $casilla->save();
        }

        // Devolver una respuesta
        return response()->json(['message' => 'Casillas cargadas correctamente desde el archivo CSV!'], 200);
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
            'votosNulos' => 'nullable|int',
            'votosTotales' => 'nullable|int',
            'ubicacion' => 'required|string',

        ]);

        $casilla = CasillasModel::find($id);

        $casilla->id_seccion = $request->id_seccion;
        $casilla->tipoCasilla = $request->tipoCasilla;
        $casilla->votosNulos = $request->votosNulos;
        $casilla->votosTotales = $request->votosTotales;
        $casilla->ubicacion = $request->ubicacion;


        $casilla->save();

        return response()->json(['message' => 'Casilla actualizada correctamente'], 200);
    }

    public function updateStatusToTwo(string $id)
    {
        $casilla = CasillasModel::find($id);

        if ($casilla) {
            $casilla->status = 2;
            $casilla->save();

            return response()->json(['message' => 'El status de la casilla se actualizó correctamente a 2'], 200);
        } else {
            return response()->json(['message' => 'No se encontró la casilla con el ID proporcionado'], 404);
        }
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
        $seccionesConDistrito = DB::table('casilla')
            ->join('secciones', 'casilla.id_seccion', '=', 'secciones.id')
            ->select('casilla.id', 'casilla.ubicacion', 'casilla.id_seccion', 'casilla.status', 'casilla.tipoCasilla', 'casilla.listaNominal', 'secciones.descripcion')
            ->get();
        // Devolver las secciones como respuesta JSON
        return response()->json($seccionesConDistrito);

    }

    public function listarCasillaPorSeccion($id_seccion)
    {
        // Obtener todas las secciones
        $seccionesConDistrito = DB::table('casilla')
            ->join('secciones', 'casilla.id_seccion', '=', 'secciones.id')
            ->where('casilla.id_seccion', $id_seccion)
            ->where('casilla.status', '<>',1)
            ->select('casilla.id', 'casilla.id_seccion', 'casilla.tipoCasilla', 'casilla.listaNominal', 'secciones.descripcion')
            ->get();

        // Devolver las secciones como respuesta JSON
        return response()->json($seccionesConDistrito);
    }

    public function listarCasillaPorSeccionGral($id_seccion)
    {
        // Obtener todas las secciones
        $seccionesConDistrito = DB::table('casilla')
            ->join('secciones', 'casilla.id_seccion', '=', 'secciones.id')
            ->where('casilla.id_seccion', $id_seccion)
            ->select('casilla.id', 'casilla.id_seccion', 'casilla.tipoCasilla', 'casilla.listaNominal', 'secciones.descripcion', 'casilla.status')
            ->get();

        // Devolver las secciones como respuesta JSON
        return response()->json($seccionesConDistrito);
    }

    public function countCasillas()
    {
        $totalCasillas = DB::table('casilla')->count();
        $avanceCasillas = DB::table('casilla')->where('status', 1)->count();

        // Devolver el total de casillas y el avance como respuesta JSON
        return response()->json(['totalCasillas' => $totalCasillas, 'avanceCasillas' => $avanceCasillas]);
    }



}
