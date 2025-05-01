<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string',
            'foto_perfil' => 'nullable|image|max:5120', // 5MB máximo
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $userData = [
            'name' => $request->name,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
        ];
        
        // Procesar foto de perfil si se proporciona
        if ($request->hasFile('foto_perfil')) {
            $path = $request->file('foto_perfil')->store('fotos_perfil', 'public');
            $userData['foto_perfil'] = $path;
        }

        $user = User::create($userData);

        // Asignar rol de usuario por defecto
        $user->assignRole('user');

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Credentials.',
            ], 401);
        }
        
        $user = User::where('email', $request->email)->firstOrFail();
        
        // Verificar si el usuario está activo
        if (!$user->active) {
            return response()->json([
                'success' => false,
                'message' => 'User is inactive'
            ], 403);
        }

        // Eliminar tokens anteriores
        $user->tokens()->delete();
        
        $token = $user->createToken('auth_token')->plainTextToken;
        
        // Verificar si el usuario administra emprendimientos
        $administraEmprendimientos = $user->administraEmprendimientos();

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'administra_emprendimientos' => $administraEmprendimientos,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ]);
    }

    public function profile()
    {
        $user = Auth::user();
        $user->load('emprendimientos.asociacion');
        
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'administra_emprendimientos' => $user->administraEmprendimientos(),
                'emprendimientos' => $user->emprendimientos
            ]
        ]);
    }
    
    public function updateProfile(Request $request)
    {
        \Log::info('Content-Type: ' . $request->header('Content-Type'));
        \Log::info('Datos recibidos: ', $request->all());
        \Log::info('Archivos recibidos: ', $request->allFiles());
        
        $user = Auth::user();
        
        $rules = [
            'name' => 'sometimes|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string',
            'foto_perfil' => 'nullable|image|max:5120', // 5MB máximo
            'password' => 'nullable|string|min:8|confirmed',
        ];
        
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $userData = $request->only(['name', 'first_name', 'last_name', 'email', 'phone']);
        
        // Actualizar contraseña si se proporciona
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }
        
        // Verificar manualmente la carga de archivos
        \Log::info('¿La solicitud tiene archivo?: ' . ($request->hasFile('foto_perfil') ? 'sí' : 'no'));
        
        // Procesar foto de perfil si se proporciona
        if ($request->hasFile('foto_perfil') && $request->file('foto_perfil')->isValid()) {
            \Log::info('Procesando foto de perfil');
            // Eliminar foto anterior si existe
            if ($user->foto_perfil && !filter_var($user->foto_perfil, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete($user->foto_perfil);
            }
            
            $path = $request->file('foto_perfil')->store('fotos_perfil', 'public');
            $userData['foto_perfil'] = $path;
        } else {
            \Log::info('No se encontró una foto de perfil válida');
        }
        
        $user->update($userData);
        
        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado correctamente',
            'data' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}