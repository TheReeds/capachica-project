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