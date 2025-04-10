<?php

namespace App\pagegeneral\controller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\pagegeneral\repository\SliderRepository;
use Illuminate\Http\JsonResponse;

class SliderController extends Controller
{
    // GET /api/sliders
    public function index(): JsonResponse
    {
        $sliders = SliderRepository::listar();
        return response()->json($sliders);
    }

    // GET /api/sliders/{id}
    public function show($id): JsonResponse
    {
        try {
            $slider = SliderRepository::obtenerPorId($id);
            return response()->json($slider);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Slider no encontrado'], 404);
        }
    }

    // POST /api/sliders
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|string',
        ]);

        $slider = SliderRepository::crear($data);
        return response()->json($slider, 201);
    }

    // PUT /api/sliders/{id}
    public function update(Request $request, $id): JsonResponse
    {
        $data = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|string',
        ]);

        try {
            $slider = SliderRepository::actualizar($id, $data);
            return response()->json($slider);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Slider no encontrado o error al actualizar'], 404);
        }
    }

    // DELETE /api/sliders/{id}
    public function destroy($id): JsonResponse
    {
        try {
            SliderRepository::eliminar($id);
            return response()->json(['mensaje' => 'Slider eliminado correctamente']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Slider no encontrado'], 404);
        }
    }
}
