<?php

namespace App\Servicios\Controllers;

use App\Http\Controllers\Controller;
use App\Servicios\Repository\EmprendedorRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmprendedorController extends Controller
{
    protected $repository;

    public function __construct(EmprendedorRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index(): JsonResponse
    {
        $emprendedores = $this->repository->getPaginated();
        return response()->json([
            'success' => true,
            'data' => $emprendedores
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $emprendedor = $this->repository->findWithServicios($id);
        
        if (!$emprendedor) {
            return response()->json([
                'success' => false,
                'message' => 'Emprendedor no encontrado'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $emprendedor
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:emprendedores,email',
            'telefono' => 'nullable|string|max:20',
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $emprendedor = $this->repository->create($request->all());
        
        return response()->json([
            'success' => true,
            'data' => $emprendedor,
            'message' => 'Emprendedor creado exitosamente'
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:emprendedores,email,' . $id,
            'telefono' => 'nullable|string|max:20',
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $updated = $this->repository->update($id, $request->all());
        
        if (!$updated) {
            return response()->json([
                'success' => false,
                'message' => 'Emprendedor no encontrado'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $this->repository->findById($id),
            'message' => 'Emprendedor actualizado exitosamente'
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->repository->delete($id);
        
        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Emprendedor no encontrado'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Emprendedor eliminado exitosamente'
        ]);
    }
}