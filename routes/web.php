<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SeccionesController;
use App\Http\Controllers\DitritosController;
use App\Http\Controllers\PartidosPoliticosController;
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


Route::prefix('Secciones')->group(function () {
    Route::controller(SeccionesController::class)->group(function () {
        //rutas con base al prefijo
        Route::get('/', 'index')->name('Secciones.Secciones.index');
        Route::post('/save-seccion', 'store')->name('Secciones.Secciones.store');
        Route::get('/listar-secciones', 'listarSecciones')->name('Secciones.Secciones.listarSecciones');
        Route::put('/update-seccione/{id}', 'update')->name('Secciones.Secciones.update');
        Route::delete('/delete-secciones/{id}', 'destroy')->name('Secciones.Secciones.destroy');
       // Route::get('/pdf', 'generatePdf')->name('Reportes.Reportes.generatePdf');
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

require __DIR__.'/auth.php';
