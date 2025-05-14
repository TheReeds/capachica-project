<?php

namespace App\Http\Controllers\API\Evento;

use App\Http\Controllers\Controller;
use App\Evento\Repository\EventoRepository;
use App\Evento\Requests\EventoRequest;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    protected $eventoRepository;

    public function __construct(EventoRepository $eventoRepository)
    {
        $this->eventoRepository = $eventoRepository;
    }

    public function index(): JsonResponse
    {
        try {
            $eventos = $this->eventoRepository->getPaginated();
            
            // Cargar relaciones
            foreach ($eventos as $evento) {
                $evento->load(['sliders']);
            }
            
            return response()->json([
                'success' => true,
                'data' => $eventos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los eventos: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $evento = $this->eventoRepository->getById($id);
            
            if (!$evento) {
                return response()->json([
                    'success' => false,
                    'message' => 'Evento no encontrado'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $evento
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el evento: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(EventoRequest $request): JsonResponse
{
    try {
        $data = $request->validated();
        
        // Crear el evento primero
        $evento = $this->eventoRepository->create($data);

        // Procesar los sliders para manejar las imágenes binarias
        if (isset($data['sliders']) && is_array($data['sliders'])) {
            foreach ($data['sliders'] as $key => $slider) {
                if (isset($slider['imagen']) && $request->hasFile("sliders.{$key}.imagen")) {
                    $path = $request->file("sliders.{$key}.imagen")->store('sliders', 'public');
                    $data['sliders'][$key]['imagen'] = $path;
                }
                // Asegúrate de agregar 'tipo_entidad' al slider
                $data['sliders'][$key]['tipo_entidad'] = 'evento';
                $data['sliders'][$key]['entidad_id'] = $evento->id; // Asocia el slider con el evento
            }
        }

        // Verificar si hay sliders para asociar
        if (isset($data['sliders']) && is_array($data['sliders'])) {
            foreach ($data['sliders'] as $slider) {
                // Asociar cada slider con el evento recién creado
                $evento->sliders()->create($slider);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $evento,
            'message' => 'Evento creado exitosamente'
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al crear el evento: ' . $e->getMessage()
        ], 500);
    }
}




    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nombre' => 'sometimes|string|max:255',
                'descripcion' => 'sometimes|string',
                'tipo_evento' => 'sometimes|string|max:100',
                'idioma_principal' => 'sometimes|string|max:50',
                'fecha_inicio' => 'sometimes|date',
                'hora_inicio' => 'sometimes',
                'fecha_fin' => 'sometimes|date',
                'hora_fin' => 'sometimes',
                'duracion_horas' => 'sometimes|integer',
                'coordenada_x' => 'sometimes|numeric',
                'coordenada_y' => 'sometimes|numeric',
                'imagen_url' => 'nullable|string',
                'id_emprendedor' => 'sometimes|exists:emprendedores,id',
                'que_llevar' => 'nullable|string',
            ]);

            $evento = $this->eventoRepository->update($id, $validated);
            
            return response()->json([
                'success' => true,
                'data' => $evento,
                'message' => 'Evento actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el evento: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->eventoRepository->delete($id);
            
            return response()->json([
                'success' => true,
                'message' => 'Evento eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el evento: ' . $e->getMessage()
            ], 500);
        }
    }
}
