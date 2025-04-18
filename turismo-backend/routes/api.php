<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\PermissionController;
use App\pagegeneral\controller\SliderController;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::prefix('sliders')->group(function () {
    Route::get('/', [SliderController::class, 'index']);
    Route::get('/{id}', [SliderController::class, 'show']);
    Route::post('/', [SliderController::class, 'store']);
    Route::put('/{id}', [SliderController::class, 'update']);
    Route::delete('/{id}', [SliderController::class, 'destroy']);
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
    Route::middleware('permission:permission_assign')->post('/permissions/assign', [PermissionController::class, 'assignPermissionsToUser']);

});