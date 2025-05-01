<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\Api\MenuController;
use App\pagegeneral\controller\SliderController;
use App\pagegeneral\Controller\MunicipalidadController;
use App\bussinespage\controller\DocenteController;
use App\jorge\controller\EstudianteController;
use App\reservas\Emprendedores\Http\Controllers\EmprendedorController;
use App\reservas\Emprendedores\Http\Controllers\MisEmprendimientosController;
use App\reservas\Asociaciones\Http\Controllers\AsociacionController;
use App\reservas\reserva\Controller\ReservaController;
use App\reservas\reservadetalle\Controller\ReservaDetalleController;
use App\Servicios\Controllers\ServicioController;
use App\Servicios\Controllers\CategoriaController;
use App\Http\Controllers\API\GoogleAuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Aquí se registran las rutas de la API del sistema
|
*/

// ===== RUTAS PÚBLICAS =====

// Autenticación
// Rutas públicas de autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas para autenticación con Google
Route::prefix('auth/google')->group(function () {
    Route::get('/', [GoogleAuthController::class, 'redirectToGoogle']);
    Route::get('/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
    Route::post('/verify-token', [GoogleAuthController::class, 'verifyGoogleToken']);
});

// Rutas para verificación de correo
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');

// Rutas para recuperación de contraseña
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
// Rutas para Google Authentication


// ===== RUTAS PÚBLICAS DEL SISTEMA DE TURISMO =====

// Municipalidades
Route::prefix('municipalidad')->group(function () {
    Route::get('/', [MunicipalidadController::class, 'index']);
    Route::get('/{id}', [MunicipalidadController::class, 'show']);
    Route::get('/{id}/relaciones', [MunicipalidadController::class, 'getWithRelations']);
    Route::get('/{id}/asociaciones', [MunicipalidadController::class, 'getWithAsociaciones']);
    Route::get('/{id}/asociaciones/emprendedores', [MunicipalidadController::class, 'getWithAsociacionesAndEmprendedores']);
});

// Sliders
Route::prefix('sliders')->group(function () {
    Route::get('/', [SliderController::class, 'index']);
    Route::get('/{id}', [SliderController::class, 'show']);
    Route::get('/entidad/{tipo}/{id}', [SliderController::class, 'getByEntidad']);
    Route::get('/municipalidad/{municipalidadId}', [SliderController::class, 'getByMunicipalidadId']);
    Route::get('/{id}/with-descripciones', [SliderController::class, 'getWithDescripciones']);
    Route::get('/sliders/{id}/image', [SliderController::class, 'getImage']);
});

// Asociaciones
Route::prefix('asociaciones')->group(function () {
    Route::get('/', [AsociacionController::class, 'index']);
    Route::get('/{id}', [AsociacionController::class, 'show']);
    Route::get('/{id}/emprendedores', [AsociacionController::class, 'getEmprendedores']);
    Route::get('/municipalidad/{municipalidadId}', [AsociacionController::class, 'getByMunicipalidad']);
});

// Emprendedores (rutas públicas)
Route::prefix('emprendedores')->group(function () {
    Route::get('/', [EmprendedorController::class, 'index']);
    Route::get('/{id}', [EmprendedorController::class, 'show']);
    Route::get('/categoria/{categoria}', [EmprendedorController::class, 'byCategory']);
    Route::get('/asociacion/{asociacionId}', [EmprendedorController::class, 'byAsociacion']);
    Route::get('/search', [EmprendedorController::class, 'search']);
    Route::get('/{id}/servicios', [EmprendedorController::class, 'getServicios']);
    Route::get('/{id}/relaciones', [EmprendedorController::class, 'getWithRelations']);
});

// Servicios
Route::prefix('servicios')->group(function () {
    Route::get('/', [ServicioController::class, 'index']);
    Route::get('/{id}', [ServicioController::class, 'show']);
    Route::get('/emprendedor/{emprendedorId}', [ServicioController::class, 'byEmprendedor']);
    Route::get('/categoria/{categoriaId}', [ServicioController::class, 'byCategoria']);
});

// Categorías
Route::prefix('categorias')->group(function () {
    Route::get('/', [CategoriaController::class, 'index']);
    Route::get('/{id}', [CategoriaController::class, 'show']);
});

// ===== RUTAS PROTEGIDAS =====
Route::middleware('auth:sanctum')->group(function () {
    // Perfil de usuario
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    // Reenviar correo de verificación
    Route::post('/email/verification-notification', [AuthController::class, 'resendVerificationEmail']);
    
    // Menú dinámico
    Route::get('/menu', [MenuController::class, 'getMenu']);
    
    // Mis Emprendimientos (para usuarios emprendedores)
    Route::prefix('mis-emprendimientos')->group(function () {
        Route::get('/', [MisEmprendimientosController::class, 'index']);
        Route::get('/{id}', [MisEmprendimientosController::class, 'show']);
        Route::get('/{id}/servicios', [MisEmprendimientosController::class, 'getServicios']);
        Route::get('/{id}/reservas', [MisEmprendimientosController::class, 'getReservas']);
        Route::post('/{id}/administradores', [MisEmprendimientosController::class, 'agregarAdministrador']);
        Route::delete('/{id}/administradores/{userId}', [MisEmprendimientosController::class, 'eliminarAdministrador']);
    });
    
    // Municipalidades (rutas protegidas)
    Route::prefix('municipalidad')->group(function () {
        Route::post('/', [MunicipalidadController::class, 'store'])->middleware('permission:municipalidad_update');
        Route::put('/{id}', [MunicipalidadController::class, 'update'])->middleware('permission:municipalidad_update');
        Route::delete('/{id}', [MunicipalidadController::class, 'destroy'])->middleware('permission:municipalidad_update');
    });
    
    // Sliders (rutas protegidas)
    Route::prefix('sliders')->group(function () {
        Route::post('/', [SliderController::class, 'store']);
        Route::post('/multiple', [SliderController::class, 'storeMultiple']);
        Route::put('/{id}', [SliderController::class, 'update']);
        Route::delete('/{id}', [SliderController::class, 'destroy']);
    });
    
    // Asociaciones (rutas protegidas)
    Route::prefix('asociaciones')->group(function () {
        Route::post('/', [AsociacionController::class, 'store']);
        Route::put('/{id}', [AsociacionController::class, 'update']);
        Route::delete('/{id}', [AsociacionController::class, 'destroy']);
    });
    
    // Emprendedores (rutas protegidas)
    Route::prefix('emprendedores')->group(function () {
        Route::post('/', [EmprendedorController::class, 'store'])->middleware('permission:emprendedor_create');
        Route::put('/{id}', [EmprendedorController::class, 'update']);
        Route::delete('/{id}', [EmprendedorController::class, 'destroy']);
        Route::get('/{id}/reservas', [EmprendedorController::class, 'getReservas']);
        
        // Gestión de administradores de emprendimientos
        Route::post('/{id}/administradores', [EmprendedorController::class, 'agregarAdministrador']);
        Route::delete('/{id}/administradores/{userId}', [EmprendedorController::class, 'eliminarAdministrador']);
    });
    
    // Servicios (rutas protegidas)
    Route::prefix('servicios')->group(function () {
        Route::post('/', [ServicioController::class, 'store']);
        Route::put('/{id}', [ServicioController::class, 'update']);
        Route::delete('/{id}', [ServicioController::class, 'destroy']);
    });
    
    // Categorías (rutas protegidas)
    Route::prefix('categorias')->group(function () {
        Route::post('/', [CategoriaController::class, 'store']);
        Route::put('/{id}', [CategoriaController::class, 'update']);
        Route::delete('/{id}', [CategoriaController::class, 'destroy']);
    });
    
    // Reservas
    Route::prefix('reservas')->group(function () {
        Route::get('/', [ReservaController::class, 'index']);
        Route::get('/{id}', [ReservaController::class, 'show']);
        Route::post('/', [ReservaController::class, 'store']);
        Route::put('/{id}', [ReservaController::class, 'update']);
        Route::delete('/{id}', [ReservaController::class, 'destroy']);
        Route::get('/{id}/emprendedores', [ReservaController::class, 'getEmprendedores']);
    });
    
    // Detalles de Reserva
    Route::prefix('reserva-detalles')->group(function () {
        Route::get('/', [ReservaDetalleController::class, 'index']);
        Route::get('/{id}', [ReservaDetalleController::class, 'show']);
        Route::post('/', [ReservaDetalleController::class, 'store']);
        Route::put('/{id}', [ReservaDetalleController::class, 'update']);
        Route::delete('/{id}', [ReservaDetalleController::class, 'destroy']);
        Route::get('/reserva/{reservaId}', [ReservaDetalleController::class, 'getByReserva']);
        Route::get('/emprendedor/{emprendedorId}', [ReservaDetalleController::class, 'getByEmprendedor']);
    });
    
    // ===== RUTAS DE ADMINISTRACIÓN (CON PERMISOS) =====
    
    // Roles
    Route::prefix('roles')->middleware('permission:role_read')->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::post('/', [RoleController::class, 'store'])->middleware('permission:role_create');
        Route::put('/{id}', [RoleController::class, 'update'])->middleware('permission:role_update');
        Route::delete('/{id}', [RoleController::class, 'destroy'])->middleware('permission:role_delete');
    });
    
    // Permisos
    Route::prefix('permissions')->middleware('permission:permission_read')->group(function () {
        Route::get('/', [PermissionController::class, 'index']);
        Route::post('/assign-to-user', [PermissionController::class, 'assignPermissionsToUser'])->middleware('permission:permission_assign');
        Route::post('/assign-to-role', [PermissionController::class, 'assignPermissionsToRole'])->middleware('permission:permission_assign');
        Route::get('/users/{id}/permissions', [PermissionController::class, 'getUserPermissions']);
    });
    
    // Gestión de Usuarios
    Route::prefix('users')->middleware('permission:user_read')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::post('/', [UserController::class, 'store'])->middleware('permission:user_create');
        Route::put('/{id}', [UserController::class, 'update'])->middleware('permission:user_update');
        Route::delete('/{id}', [UserController::class, 'destroy'])->middleware('permission:user_delete');
        Route::put('/{id}/activate', [UserController::class, 'activate'])->middleware('permission:user_update');
        Route::put('/{id}/deactivate', [UserController::class, 'deactivate'])->middleware('permission:user_update');
        Route::put('/{id}/roles', [UserController::class, 'assignRoles'])->middleware('permission:user_update');
    });
    
    // Dashboard
    Route::prefix('dashboard')->middleware('permission:user_read')->group(function () {
        Route::get('/summary', [DashboardController::class, 'summary']);
    });
});