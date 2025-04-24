<?php

namespace App\Servicios\Controllers;

use App\Http\Controllers\Controller;
use App\Servicios\Repository\ServicioRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServicioController extends Controller
{
    protected $repository;

    public function __construct(ServicioRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index(): JsonResponse
    {
        $servicios = $this->repository->getPaginated();
        return response()->json([
            'success' => true,
            'data' => $servicios
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $servicio = $this->repository->findById($id);
        
        if (!$servicio) {
            return response()->json([
                'success' => false,
                'message' => 'Servicio no encontrado'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $servicio
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio_referencial' => 'nullable|numeric|min:0',
            'emprendedor_id' => 'required|exists:emprendedores,id',
            'estado' => 'boolean',
            'categorias' => 'nullable|array',
            'categorias.*' => 'exists:categorias,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $categorias = $request->input('categorias', []);
        $servicio = $this->repository->create($request->except('categorias'), $categorias);
        
        return response()->json([
            'success' => true,
            'data' => $servicio,
            'message' => 'Servicio creado exitosamente'
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio_referencial' => 'nullable|numeric|min:0',
            'emprendedor_id' => 'sometimes|required|exists:emprendedores,id',
            'estado' => 'boolean',
            'categorias' => 'nullable|array',
            'categorias.*' => 'exists:categorias,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $categorias = $request->input('categorias', []);
        $updated = $this->repository->update($id, $request->except('categorias'), $categorias);
        
        if (!$updated) {
            return response()->json([
                'success' => false,
                'message' => 'Servicio no encontrado'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $this->repository->findById($id),
            'message' => 'Servicio actualizado exitosamente'
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->repository->delete($id);
        
        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Servicio no encontrado'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Servicio eliminado exitosamente'
        ]);
    }

    public function byEmprendedor(int $emprendedorId): JsonResponse
    {
        $servicios = $this->repository->getServiciosByEmprendedor($emprendedorId);
        
        return response()->json([
            'success' => true,
            'data' => $servicios
        ]);
    }

    public function byCategoria(int $categoriaId): JsonResponse
    {
        $servicios = $this->repository->getServiciosByCategoria($categoriaId);
        
        return response()->json([
            'success' => true,
            'data' => $servicios
        ]);
    }
}