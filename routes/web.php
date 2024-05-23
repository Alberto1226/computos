<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SeccionesController;
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

require __DIR__.'/auth.php';
