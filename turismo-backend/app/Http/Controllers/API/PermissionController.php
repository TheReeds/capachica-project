<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::all();
        
        return response()->json([
            'success' => true,
            'data' => $permissions
        ]);
    }

    public function assignPermissionsToUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);
        $user->syncPermissions($request->permissions);

        return response()->json([
            'success' => true,
            'message' => 'Permissions assigned successfully',
            'data' => [
                'user' => $user->only(['id', 'name', 'email']),
                'permissions' => $user->getAllPermissions()->pluck('name')
            ]
        ]);
    }
}