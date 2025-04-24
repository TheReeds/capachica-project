<?php

namespace App\pagegeneral\controller;

use App\Http\Controllers\Controller;
use App\pagegeneral\Repository\SobreNosotrosRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SobreNosotrosController extends Controller
{
    protected $sobreNosotrosRepository;

    public function __construct(SobreNosotrosRepository $sobreNosotrosRepository)
    {
        $this->sobreNosotrosRepository = $sobreNosotrosRepository;
    }

    public function index()
    {
        $sobreNosotros = $this->sobreNosotrosRepository->getAll();
        return response()->json(['data' => $sobreNosotros], 200);
    }

    public function show($id)
    {
        try {
            $sobreNosotros = $this->sobreNosotrosRepository->getById($id);
            return response()->json(['data' => $sobreNosotros], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Información sobre nosotros no encontrada'], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mision' => 'required|string',
            'vision' => 'required|string',
            'valores' => 'required|string',
            'historia' => 'required|string',
            'objetivos' => 'nullable|string',
            'imagen_historia_url' => 'nullable|string|max:255',
            'comite_distrital_turismo' => 'required|string',
            'imagen_comite_url' => 'nullable|string|max:255',
            'municipalidad_id' => 'required|exists:municipalidad,id',
            'fecha_actualizacion' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $sobreNosotros = $this->sobreNosotrosRepository->create($request->all());
        return response()->json(['data' => $sobreNosotros, 'message' => 'Información sobre nosotros creada con éxito'], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'mision' => 'sometimes|string',
            'vision' => 'sometimes|string',
            'valores' => 'sometimes|string',
            'historia' => 'sometimes|string',
            'objetivos' => 'nullable|string',
            'imagen_historia_url' => 'nullable|string|max:255',
            'comite_distrital_turismo' => 'sometimes|string',
            'imagen_comite_url' => 'nullable|string|max:255',
            'municipalidad_id' => 'sometimes|exists:municipalidad,id',
            'fecha_actualizacion' => 'sometimes|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $sobreNosotros = $this->sobreNosotrosRepository->update($id, $request->all());
            return response()->json(['data' => $sobreNosotros, 'message' => 'Información sobre nosotros actualizada con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Información sobre nosotros no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->sobreNosotrosRepository->delete($id);
            return response()->json(['message' => 'Información sobre nosotros eliminada con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Información sobre nosotros no encontrada'], 404);
        }
    }

    public function getByMunicipalidadId($municipalidadId)
    {
        $sobreNosotros = $this->sobreNosotrosRepository->getByMunicipalidadId($municipalidadId);
        if (!$sobreNosotros) {
            return response()->json(['message' => 'Información sobre nosotros no encontrada para esta municipalidad'], 404);
        }
        return response()->json(['data' => $sobreNosotros], 200);
    }
}