<?php

namespace App\Http\Controllers;

use App\Models\CasillasModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\ResultadosModel;
use App\Models\DistritosModel;
use Illuminate\Support\Facades\Auth;

class ResultadosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Resultados/index');
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
        $totales = $request->input('totales');
        foreach ($totales as $total) {
            $des = DistritosModel::findOrFail($total['id_distrito']);
            $regTotales = new ResultadosModel();
            $regTotales->id_casilla = $total['id_casilla'];
            $regTotales->id_partido = $total['id_partido'];
            $regTotales->id_coalicion = $total['id_coalicion'];
            $regTotales->id_eleccion = $total['id_eleccion'];
            $regTotales->total = $total['total'];
            $regTotales->id_user = $id;
            $regTotales->save();
            $des->avanceVotos += $total['total'];
            $des->save();

            $casilla = CasillasModel::findOrFail($total['id_casilla']);
            $casilla->status = 1;
            $casilla->save();
        }
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function listarPorTipoEleccion($id_eleccion)
    {
        $resultados = DB::table('resultados')
            ->leftJoin('partidospoliticos', function ($join) {
                $join->on('resultados.id_partido', '=', 'partidospoliticos.id')
                    ->where('resultados.id_partido', '!=', 0);
            })
            ->leftJoin('coaliciones', function ($join) {
                $join->on('resultados.id_coalicion', '=', 'coaliciones.id')
                    ->where('resultados.id_coalicion', '!=', 0);
            })
            ->join('casilla', 'resultados.id_casilla', '=', 'casilla.id')
            ->join('secciones', 'casilla.id_seccion', '=', 'secciones.id') // Nueva línea
            ->where('resultados.id_eleccion', $id_eleccion)
            ->select(
                'resultados.*',
                DB::raw('CASE WHEN resultados.id_partido != 0 THEN partidospoliticos.nombrePartido ELSE NULL END as nombrePartido'),
                DB::raw('CASE WHEN resultados.id_partido != 0 THEN partidospoliticos.abrebiatura ELSE NULL END as abreviaturaPartido'),
                DB::raw('CASE WHEN resultados.id_partido != 0 THEN partidospoliticos.color ELSE NULL END as colorPartido'),
                DB::raw('CASE WHEN resultados.id_coalicion != 0 THEN coaliciones.descripcion ELSE NULL END as nombreCoalicion'),
                'secciones.descripcion as descripcionSeccion', // Nueva línea
                'casilla.tipoCasilla as tipoDeCasilla',
                'secciones.id as seccionCons',
            )
            ->orderBy('secciones.descripcion')
            ->get();

        // Devolver una respuesta JSON con las unidades de medida
        return response()->json($resultados);
    }

    public function TotaldeVotos($id_eleccion)
    {
        $resultados = DB::table('resultados')
        ->leftJoin('partidospoliticos', 'resultados.id_partido', '=', 'partidospoliticos.id')
        ->where('resultados.id_eleccion', $id_eleccion)
        ->select(
            DB::raw('SUM(resultados.total) as totalVotos'),
            DB::raw('SUM(CASE WHEN partidospoliticos.nombrePartido = "VOTOS NULOS" THEN resultados.total ELSE 0 END) as votosNulos')
        );

    // Devolver una respuesta JSON con los resultados
    return response()->json($resultados->get());
    }



}
