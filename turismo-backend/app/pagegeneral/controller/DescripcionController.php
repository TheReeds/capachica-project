<?php

namespace App\pagegeneral\controller;

use App\Http\Controllers\Controller;
use App\pagegeneral\Repository\DescripcionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DescripcionController extends Controller
{
    protected $descripcionRepository;

    public function __construct(DescripcionRepository $descripcionRepository)
    {
        $this->descripcionRepository = $descripcionRepository;
    }

    public function index()
    {
        $descripciones = $this->descripcionRepository->getAll();
        return response()->json(['data' => $descripciones], 200);
    }

    public function show($id)
    {
        try {
            $descripcion = $this->descripcionRepository->getById($id);
            return response()->json(['data' => $descripcion], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Descripción no encontrada'], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|max:255',
            'imagen_url' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'slider_id' => 'required|exists:sliders,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $descripcion = $this->descripcionRepository->create($request->all());
        return response()->json(['data' => $descripcion, 'message' => 'Descripción creada con éxito'], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'sometimes|string|max:255',
            'imagen_url' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'slider_id' => 'sometimes|exists:sliders,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $descripcion = $this->descripcionRepository->update($id, $request->all());
            return response()->json(['data' => $descripcion, 'message' => 'Descripción actualizada con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Descripción no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->descripcionRepository->delete($id);
            return response()->json(['message' => 'Descripción eliminada con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Descripción no encontrada'], 404);
        }
    }

    public function getBySliderId($sliderId)
    {
        $descripciones = $this->descripcionRepository->getBySliderId($sliderId);
        return response()->json(['data' => $descripciones], 200);
    }

    public function getWithFotos($id)
    {
        try {
            $descripcion = $this->descripcionRepository->getWithFotos($id);
            return response()->json(['data' => $descripcion], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Descripción no encontrada'], 404);
        }
    }
}