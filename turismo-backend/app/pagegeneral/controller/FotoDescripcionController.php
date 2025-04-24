<?php

namespace App\pagegeneral\controller;

use App\Http\Controllers\Controller;
use App\pagegeneral\Repository\FotoDescripcionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FotoDescripcionController extends Controller
{
    protected $fotoDescripcionRepository;

    public function __construct(FotoDescripcionRepository $fotoDescripcionRepository)
    {
        $this->fotoDescripcionRepository = $fotoDescripcionRepository;
    }

    public function index()
    {
        $fotos = $this->fotoDescripcionRepository->getAll();
        return response()->json(['data' => $fotos], 200);
    }

    public function show($id)
    {
        try {
            $foto = $this->fotoDescripcionRepository->getById($id);
            return response()->json(['data' => $foto], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Foto no encontrada'], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'foto_url' => 'required|string|max:255',
            'descripcion_url' => 'nullable|string|max:255',
            'descripcion_id' => 'required|exists:descripciones,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $foto = $this->fotoDescripcionRepository->create($request->all());
        return response()->json(['data' => $foto, 'message' => 'Foto creada con éxito'], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'foto_url' => 'sometimes|string|max:255',
            'descripcion_url' => 'nullable|string|max:255',
            'descripcion_id' => 'sometimes|exists:descripciones,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $foto = $this->fotoDescripcionRepository->update($id, $request->all());
            return response()->json(['data' => $foto, 'message' => 'Foto actualizada con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Foto no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->fotoDescripcionRepository->delete($id);
            return response()->json(['message' => 'Foto eliminada con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Foto no encontrada'], 404);
        }
    }

    public function getByDescripcionId($descripcionId)
    {
        $fotos = $this->fotoDescripcionRepository->getByDescripcionId($descripcionId);
        return response()->json(['data' => $fotos], 200);
    }
}