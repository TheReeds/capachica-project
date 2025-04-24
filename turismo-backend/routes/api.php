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


use App\pagegeneral\Controller\MunicipalidadController;
use App\pagegeneral\Controller\DescripcionMunicipalidadController;
use App\pagegeneral\Controller\DescripcionController;
use App\pagegeneral\Controller\FotoDescripcionController;
use App\pagegeneral\Controller\SobreNosotrosController;
use App\pagegeneral\Controller\ContactoController;


// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);





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


    /////////////////////////////////////////////////////
    // Rutas para Municipalidad
    Route::prefix('municipalidad')->group(function () {
        Route::get('/', [MunicipalidadController::class, 'index']);
        Route::post('/', [MunicipalidadController::class, 'store']);
        Route::get('/{id}', [MunicipalidadController::class, 'show']);
        Route::put('/{id}', [MunicipalidadController::class, 'update']);
        Route::delete('/{id}', [MunicipalidadController::class, 'destroy']);
        Route::get('/{id}/with-relations', [MunicipalidadController::class, 'getWithRelations']);
    });

    // Rutas para Sliders
    Route::prefix('sliders')->group(function () {
        Route::get('/', [SliderController::class, 'index']);
        Route::post('/', [SliderController::class, 'store']);
        Route::get('/{id}', [SliderController::class, 'show']);
        Route::put('/{id}', [SliderController::class, 'update']);
        Route::delete('/{id}', [SliderController::class, 'destroy']);
        Route::get('/municipalidad/{municipalidadId}', [SliderController::class, 'getByMunicipalidadId']);
        Route::get('/{id}/with-descripciones', [SliderController::class, 'getWithDescripciones']);
        Route::get('/sliders/{id}/image', [SliderController::class, 'getImage']);
    });

    // Rutas para Descripción Municipalidad
    Route::prefix('descripcion-municipalidad')->group(function () {
        Route::get('/', [DescripcionMunicipalidadController::class, 'index']);
        Route::post('/', [DescripcionMunicipalidadController::class, 'store']);
        Route::get('/{id}', [DescripcionMunicipalidadController::class, 'show']);
        Route::put('/{id}', [DescripcionMunicipalidadController::class, 'update']);
        Route::delete('/{id}', [DescripcionMunicipalidadController::class, 'destroy']);
        Route::get('/municipalidad/{municipalidadId}', [DescripcionMunicipalidadController::class, 'getByMunicipalidadId']);
        Route::get('/tipo/{tipo}', [DescripcionMunicipalidadController::class, 'getByTipo']);
    });

    // Rutas para Descripciones
    Route::prefix('descripciones')->group(function () {
        Route::get('/', [DescripcionController::class, 'index']);
        Route::post('/', [DescripcionController::class, 'store']);
        Route::get('/{id}', [DescripcionController::class, 'show']);
        Route::put('/{id}', [DescripcionController::class, 'update']);
        Route::delete('/{id}', [DescripcionController::class, 'destroy']);
        Route::get('/slider/{sliderId}', [DescripcionController::class, 'getBySliderId']);
        Route::get('/{id}/with-fotos', [DescripcionController::class, 'getWithFotos']);
    });

    // Rutas para Fotos Descripción
    Route::prefix('fotos-descripcion')->group(function () {
        Route::get('/', [FotoDescripcionController::class, 'index']);
        Route::post('/', [FotoDescripcionController::class, 'store']);
        Route::get('/{id}', [FotoDescripcionController::class, 'show']);
        Route::put('/{id}', [FotoDescripcionController::class, 'update']);
        Route::delete('/{id}', [FotoDescripcionController::class, 'destroy']);
        Route::get('/descripcion/{descripcionId}', [FotoDescripcionController::class, 'getByDescripcionId']);
    });

    // Rutas para Sobre Nosotros
    Route::prefix('sobre-nosotros')->group(function () {
        Route::get('/', [SobreNosotrosController::class, 'index']);
        Route::post('/', [SobreNosotrosController::class, 'store']);
        Route::get('/{id}', [SobreNosotrosController::class, 'show']);
        Route::put('/{id}', [SobreNosotrosController::class, 'update']);
        Route::delete('/{id}', [SobreNosotrosController::class, 'destroy']);
        Route::get('/municipalidad/{municipalidadId}', [SobreNosotrosController::class, 'getByMunicipalidadId']);
    });

    // Rutas para Contactos
    Route::prefix('contactos')->group(function () {
        Route::get('/', [ContactoController::class, 'index']);
        Route::post('/', [ContactoController::class, 'store']);
        Route::get('/{id}', [ContactoController::class, 'show']);
        Route::put('/{id}', [ContactoController::class, 'update']);
        Route::delete('/{id}', [ContactoController::class, 'destroy']);
        Route::get('/municipalidad/{municipalidadId}', [ContactoController::class, 'getByMunicipalidadId']);
    });

});