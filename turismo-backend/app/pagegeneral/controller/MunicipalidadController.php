<?php

namespace App\pagegeneral\controller;


use App\Http\Controllers\Controller;
use App\pagegeneral\Repository\MunicipalidadRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MunicipalidadController extends Controller
{
    protected $municipalidadRepository;

    public function __construct(MunicipalidadRepository $municipalidadRepository)
    {
        $this->municipalidadRepository = $municipalidadRepository;
    }

    public function index()
    {
        $municipalidades = $this->municipalidadRepository->getAll();
        return response()->json(['data' => $municipalidades], 200);
    }

    public function show($id)
    {
        try {
            $municipalidad = $this->municipalidadRepository->getById($id);
            return response()->json(['data' => $municipalidad], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Municipalidad no encontrada'], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'redes_url' => 'nullable|string|max:255',
            'red_facebook' => 'nullable|string|max:255',
            'red_twitter' => 'nullable|string|max:255',
            'red_whatsapp' => 'nullable|string|max:255',
            'coordenadas_x' => 'nullable|numeric',
            'coordenadas_y' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $municipalidad = $this->municipalidadRepository->create($request->all());
        return response()->json(['data' => $municipalidad, 'message' => 'Municipalidad creada con éxito'], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|string|max:255',
            'titulo' => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string',
            'redes_url' => 'nullable|string|max:255',
            'red_facebook' => 'nullable|string|max:255',
            'red_twitter' => 'nullable|string|max:255',
            'red_whatsapp' => 'nullable|string|max:255',
            'coordenadas_x' => 'nullable|numeric',
            'coordenadas_y' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $municipalidad = $this->municipalidadRepository->update($id, $request->all());
            return response()->json(['data' => $municipalidad, 'message' => 'Municipalidad actualizada con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Municipalidad no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->municipalidadRepository->delete($id);
            return response()->json(['message' => 'Municipalidad eliminada con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Municipalidad no encontrada'], 404);
        }
    }

    public function getWithRelations($id)
    {
        try {
            $municipalidad = $this->municipalidadRepository->getWithRelations($id);
            return response()->json(['data' => $municipalidad], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Municipalidad no encontrada'], 404);
        }
    }
}
