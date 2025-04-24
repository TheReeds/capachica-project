<?php

namespace App\reservas\Emprendedores\Http\Controllers;

use Illuminate\Http\Response;

use App\reservas\Emprendedores\Http\Requests\EmprendedorRequest;
use App\reservas\Emprendedores\Services\EmprendedoresService;
use App\reservas\Emprendedores\Models\Emprendedor;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmprendedorController extends Controller
{
    protected $emprendedorService;

    public function __construct(EmprendedoresService $emprendedorService)
    {
        $this->emprendedorService = $emprendedorService;
    }

    /**
     * Mostrar todos los emprendedores
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->query('per_page', 15);
        $emprendedores = $this->emprendedorService->getAll($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $emprendedores
        ]);
    }

    /**
     * Almacenar un nuevo emprendedor
     */
    public function store(EmprendedorRequest $request)
    {
        try{
            $data = $request->validated();

            $resultado = $this->emprendedorService->create($data);
            return response()->json([
                'success' => true,
                'message' => 'Registro creado exitosamente',
                'data' => $resultado
            ], Response::HTTP_CREATED);
        }catch(\Exception $e){
            Log::error('Error al crear registro: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        
        /*$data = $request->validated()

        $emprendedor = $this->emprendedorService->create($request->validated());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Emprendedor creado exitosamente',
            'data' => $emprendedor
        ], 201);*/
    }

    /**
     * Mostrar un emprendedor específico
     */
    public function show(int $id): JsonResponse
    {
        $emprendedor = $this->emprendedorService->getById($id);

        if (!$emprendedor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Emprendedor no encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $emprendedor
        ]);
    }

    /**
     * Actualizar un emprendedor
     */
    public function update(EmprendedorRequest $request, int $id): JsonResponse
    {
        //$emprendedor = $this->emprendedorService->update($id, $request->validated());
        try {
            // Los datos ya están validados por el Request
            $datos = $request->validated();
            
            // Usar el servicio para actualizar el registro
            $resultado = $this->emprendedorService->update($id, $datos);
            
            if (!$resultado) {
                return response()->json([
                    'success' => false,
                    'message' => 'Registro no encontrado'
                ], Response::HTTP_NOT_FOUND);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Registro actualizado exitosamente',
                'data' => $resultado
            ], Response::HTTP_OK);
            
        } catch (\Exception $e) {
            Log::error('Error al actualizar registro: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        /*if (!$emprendedor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Emprendedor no encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Emprendedor actualizado exitosamente',
            'data' => $emprendedor
        ]);*/
    }

    /**
     * Eliminar un emprendedor
     */
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->emprendedorService->delete($id);

        if (!$deleted) {
            return response()->json([
                'status' => 'error',
                'message' => 'Emprendedor no encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Emprendedor eliminado exitosamente'
        ]);
    }

    /**
     * Buscar emprendedores por categoría
     */
    public function byCategory(string $categoria): JsonResponse
    {
        $emprendedores = $this->emprendedorService->findByCategory($categoria);

        return response()->json([
            'status' => 'success',
            'data' => $emprendedores
        ]);
    }

    /**
     * Buscar emprendedores
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->query('q');

        if (!$query) {
            return response()->json([
                'status' => 'error',
                'message' => 'Parámetro de búsqueda requerido'
            ], 400);
        }

        $emprendedores = $this->emprendedorService->search($query);

        return response()->json([
            'status' => 'success',
            'data' => $emprendedores
        ]);
    }
}
