<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ResultadosModel;

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
        $totales = $request->input('totales');
        foreach ($totales as $total) {
            $regTotales = new ResultadosModel();
            $regTotales->id_casilla = $total['id_casilla'];
            $regTotales->id_partido = $total['id_partido'];
            $regTotales->id_coalicion = $total['id_coalicion'];
            $regTotales->id_eleccion = $total['id_eleccion'];
            $regTotales->total = $total['total'];
            $regTotales->save();
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
}
