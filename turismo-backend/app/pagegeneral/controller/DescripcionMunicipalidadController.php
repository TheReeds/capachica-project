<?php

namespace App\pagegeneral\controller;

use App\Http\Controllers\Controller;
use App\pagegeneral\Repository\DescripcionMunicipalidadRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DescripcionMunicipalidadController extends Controller
{
    protected $descripcionMunicipalidadRepository;

    public function __construct(DescripcionMunicipalidadRepository $descripcionMunicipalidadRepository)
    {
        $this->descripcionMunicipalidadRepository = $descripcionMunicipalidadRepository;
    }

    public function index()
    {
        $descripciones = $this->descripcionMunicipalidadRepository->getAll();
        return response()->json(['data' => $descripciones], 200);
    }

    public function show($id)
    {
        try {
            $descripcion = $this->descripcionMunicipalidadRepository->getById($id);
            return response()->json(['data' => $descripcion], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Descripción no encontrada'], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'imagen_url' => 'nullable|string|max:255',
            'tipo' => 'nullable|string|max:255',
            'campo' => 'nullable|string|max:255',
            'municipalidad_id' => 'required|exists:municipalidad,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $descripcion = $this->descripcionMunicipalidadRepository->$descripcion = $this->descripcionMunicipalidadRepository->create($request->all());
        return response()->json(['data' => $descripcion, 'message' => 'Descripción creada con éxito'], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string',
            'imagen_url' => 'nullable|string|max:255',
            'tipo' => 'nullable|string|max:255',
            'campo' => 'nullable|string|max:255',
            'municipalidad_id' => 'sometimes|exists:municipalidad,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $descripcion = $this->descripcionMunicipalidadRepository->update($id, $request->all());
            return response()->json(['data' => $descripcion, 'message' => 'Descripción actualizada con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Descripción no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->descripcionMunicipalidadRepository->delete($id);
            return response()->json(['message' => 'Descripción eliminada con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Descripción no encontrada'], 404);
        }
    }

    public function getByMunicipalidadId($municipalidadId)
    {
        $descripciones = $this->descripcionMunicipalidadRepository->getByMunicipalidadId($municipalidadId);
        return response()->json(['data' => $descripciones], 200);
    }

    public function getByTipo($tipo)
    {
        $descripciones = $this->descripcionMunicipalidadRepository->getByTipo($tipo);
        return response()->json(['data' => $descripciones], 200);
    }
}