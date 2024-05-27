<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TipoEleccionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SeccionesController;
use App\Http\Controllers\DitritosController;
use App\Http\Controllers\PartidosPoliticosController;
use App\Http\Controllers\CoalicionesController;
use App\Http\Controllers\CasillasController;
use App\Http\Controllers\ResultadosController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::prefix('Distritos')->group(function () {
    Route::controller(DitritosController::class)->group(function () {
        //rutas con base al prefijo
        Route::get('/', 'index')->name('Distritos.Distritos.index');
        Route::post('/save-distrito', 'store')->name('Distritos.Distritos.store');
        Route::get('/list-distritos/', 'listarDistritos')->name('Distritos.Distritos.listarDistritos');
        Route::put('/update-distrito/{id}', 'update')->name('Distritos.Distritos.update');
        Route::delete('/delete-distrito/{id}', 'destroy')->name('Distritos.Distritos.destroy');
    });
});

Route::prefix('Elecciones')->group(function () {
    Route::controller(TipoEleccionController::class)->group(function () {
        //rutas con base al prefijo
        Route::get('/', 'index')->name('Elecciones.Elecciones.index');
        Route::post('/save-Elecciones', 'store')->name('Elecciones.Elecciones.store');
        Route::get('/list-Elecciones', 'listarElecciones')->name('Elecciones.Elecciones.listarElecciones');
        Route::put('/update-Elecciones/{id}', 'update')->name('Elecciones.Elecciones.update');
        Route::delete('/delete-Elecciones/{id}', 'destroy')->name('Elecciones.Elecciones.destroy');
        Route::delete('/delete-db', 'resetDatabase')->name('Elecciones.Elecciones.resetDatabase');
    });
});


Route::prefix('Secciones')->group(function () {
    Route::controller(SeccionesController::class)->group(function () {
        //rutas con base al prefijo
        Route::get('/', 'index')->name('Secciones.Secciones.index');
        Route::post('/save-seccion', 'store')->name('Secciones.Secciones.store');
        Route::get('/listar-secciones', 'listarSecciones')->name('Secciones.Secciones.listarSecciones');
        Route::put('/update-seccione/{id}', 'update')->name('Secciones.Secciones.update');
        Route::delete('/delete-secciones/{id}', 'destroy')->name('Secciones.Secciones.destroy');
        Route::get('/listar-seccionesDist/{id_distrito}', 'listarSeccionDistrito')->name('Secciones.Secciones.listarSeccionDistrito');
       // Route::get('/pdf', 'generatePdf')->name('Reportes.Reportes.generatePdf');
       Route::post('/upload-csv', 'storeFromCSV')->name('Secciones.Secciones.storeFromCSV');
    });
});

Route::prefix('PartidosPoliticos')->group(function () {
    Route::controller(PartidosPoliticosController::class)->group(function () {
        Route::get('/', 'index')->name('PartidosPoliticos.PartidosPoliticos.index');
        Route::post('/save-partido', 'store')->name('PartidosPoliticos.PartidosPoliticos.store');
        Route::get('/listar-partidos', 'listarPartidos')->name('PartidosPoliticos.PartidosPoliticos.listarPartidos');
        Route::put('/update-partido/{id}', 'update')->name('PartidosPoliticos.PartidosPoliticos.update');
        Route::delete('/delete-partido/{id}', 'destroy')->name('PartidosPoliticos.PartidosPoliticos.destroy');
    });
});

Route::prefix('Coaliciones')->group(function () {
    Route::controller(CoalicionesController::class)->group(function () {
        Route::get('/', 'index')->name('Coaliciones.Coaliciones.index');
        Route::post('/save-coalicion', 'store')->name('Coaliciones.Coaliciones.store');
        Route::get('/listar-coaliciones', 'listarCoaliciones')->name('Coaliciones.Coaliciones.listarCoaliciones');
        Route::get('/listarCoaPart/{id_eleccion}', 'listarCoalicionesPartidos')->name('Coaliciones.Coaliciones.listarCoalicionesPartidos');
        Route::put('/update-coalicion/{id}', 'update')->name('Coaliciones.Coaliciones.update');
        Route::delete('/delete-coalicion/{id}', 'destroy')->name('Coaliciones.Coaliciones.destroy');
    });
});

Route::prefix('Casillas')->group(function () {
    Route::controller(CasillasController::class)->group(function () {
        Route::get('/', 'index')->name('Casillas.Casillas.index');
        Route::post('/save-casilla', 'store')->name('Casillas.Casillas.store');
        Route::get('/listar-casillas', 'listarCasillas')->name('Casillas.Casillas.listarCasillas');
        Route::put('/update-casilla/{id}', 'update')->name('Casillas.Casillas.update');
        Route::delete('/delete-casilla/{id}', 'destroy')->name('Casillas.Casillas.destroy');
        Route::post('/upload-csv', 'storeFromCSV')->name('Casillas.Casillas.storeFromCSV');
        Route::get('/listCasillasSeccion/{id_seccion}', 'listarCasillaPorSeccion')->name('Casillas.Casillas.listarCasillaPorSeccion');
    });
});

Route::prefix('Resultados')->group(function () {
    Route::controller(ResultadosController::class)->group(function () {
        //rutas con base al prefijo
        Route::get('/', 'index')->name('Resultados.Resultados.index');
        Route::post('/save-resultados', 'store')->name('Resultados.Resultados.store');
        Route::get('/listarPorTipoEleccion/{id_eleccion}', 'listarPorTipoEleccion')->name('Resultados.Resultados.listarPorTipoEleccion');

    });
});

require __DIR__.'/auth.php';
