<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\PermissionController;
use App\pagegeneral\controller\SliderController;
use App\bussinespage\controller\DocenteController;
use App\jorge\controller\EstudianteController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\DashboardController;
use App\municipalidad\Controller\MunicipalidadController;
use App\reservas\reservadetalle\Controller\ReservaDetalleController;
use App\reservas\reserva\Controller\ReservaController;
use App\reservas\Emprendedores\Http\Controllers\EmprendedorController;
use App\Servicios\Controllers\ServicioController;
use App\Servicios\Controllers\EmprendedorController;
use App\Servicios\Controllers\CategoriaController;


// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::prefix('municipalidades')->group(function () {
    Route::get('/', [MunicipalidadController::class, 'index']);
    Route::post('/', [MunicipalidadController::class, 'store']);
    Route::get('{id}', [MunicipalidadController::class, 'show']);
    Route::put('{id}', [MunicipalidadController::class, 'update']);
    Route::delete('{id}', [MunicipalidadController::class, 'destroy']);
});

// neonCode
Route::prefix('reservas')->group(function () {
    Route::get('/', [ReservaController::class, 'index']);
    Route::post('/', [ReservaController::class, 'store']);
    Route::get('/{id}', [ReservaController::class, 'show']);
    Route::put('/{id}', [ReservaController::class, 'update']);
    Route::delete('/{id}', [ReservaController::class, 'destroy']);
});

Route::prefix('emprendedores')->group(function () {
    Route::get('/', [EmprendedorController::class, 'index']);
    Route::post('/', [EmprendedorController::class, 'store']);
    Route::get('/{id}', [EmprendedorController::class, 'show']);
    Route::put('/{id}', [EmprendedorController::class, 'update']);
    Route::delete('/{id}', [EmprendedorController::class, 'destroy']);

    // Rutas adicionales
    Route::get('/categoria/{categoria}', [EmprendedorController::class, 'byCategory']);
    Route::get('/search', [EmprendedorController::class, 'search']);
});

Route::prefix('reserva-detalle')->group(function () {
    Route::get('/', [ReservaDetalleController::class, 'index']);
    Route::post('/', [ReservaDetalleController::class, 'store']);
    Route::get('/{id}', [ReservaDetalleController::class, 'show']);
    Route::put('/{id}', [ReservaDetalleController::class, 'update']);
    Route::delete('/{id}', [ReservaDetalleController::class, 'destroy']);
});
// Eberth emprendedores
Route::apiResource('emprendedores', EmprendedorController::class);
    
    // Rutas para Categorías
Route::apiResource('categorias', CategoriaController::class);
    
    // Rutas para Servicios
Route::apiResource('servicios', ServicioController::class);
Route::get('servicios/emprendedor/{emprendedor_id}', [ServicioController::class, 'byEmprendedor']);
Route::get('servicios/categoria/{categoria_id}', [ServicioController::class, 'byCategoria']);




// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Roles (requiere permiso)
    Route::middleware('permission:role_read')->get('/roles', [RoleController::class, 'index']);
    Route::middleware('permission:role_read')->get('/roles/{id}', [RoleController::class, 'show']);
    Route::middleware('permission:role_create')->post('/roles', [RoleController::class, 'store']);
    Route::middleware('permission:role_update')->put('/roles/{id}', [RoleController::class, 'update']);
    Route::middleware('permission:role_delete')->delete('/roles/{id}', [RoleController::class, 'destroy']);
    
    // Permisos
    Route::middleware('permission:permission_read')->get('/permissions', [PermissionController::class, 'index']);
    Route::middleware('permission:permission_assign')->post('/permissions/assign-to-user', [PermissionController::class, 'assignPermissionsToUser']);
    Route::middleware('permission:permission_read')->get('/users/{id}/permissions', [PermissionController::class, 'getUserPermissions']);
    Route::middleware('permission:permission_assign')->post('/permissions/assign-to-role', [PermissionController::class, 'assignPermissionsToRole']);
    
    // Users Management (requiere permiso)
    Route::middleware('permission:user_read')->get('/users', [UserController::class, 'index']);
    Route::middleware('permission:user_read')->get('/users/{id}', [UserController::class, 'show']);
    Route::middleware('permission:user_create')->post('/users', [UserController::class, 'store']);
    Route::middleware('permission:user_update')->put('/users/{id}', [UserController::class, 'update']);
    Route::middleware('permission:user_delete')->delete('/users/{id}', [UserController::class, 'destroy']);
    Route::middleware('permission:user_update')->put('/users/{id}/activate', [UserController::class, 'activate']);
    Route::middleware('permission:user_update')->put('/users/{id}/deactivate', [UserController::class, 'deactivate']);
    Route::middleware('permission:user_update')->put('/users/{id}/roles', [UserController::class, 'assignRoles']);

    // Dashboard
    Route::middleware('permission:user_read')->get('/dashboard/summary', [DashboardController::class, 'summary']);

});