<?php

namespace App\pagegeneral\controller;


use App\Http\Controllers\Controller;
use App\pagegeneral\Repository\ContactoRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactoController extends Controller
{
    protected $contactoRepository;

    public function __construct(ContactoRepository $contactoRepository)
    {
        $this->contactoRepository = $contactoRepository;
    }

    public function index()
    {
        $contactos = $this->contactoRepository->getAll();
        return response()->json(['data' => $contactos], 200);
    }

    public function show($id)
    {
        try {
            $contacto = $this->contactoRepository->getById($id);
            return response()->json(['data' => $contacto], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Contacto no encontrado'], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre_contacto' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telefono_principal' => 'required|string|max:20',
            'telefono_secundario' => 'nullable|string|max:20',
            'horario_atencion' => 'nullable|string|max:255',
            'direccion_fisica' => 'required|string|max:255',
            'mapa_embed_url' => 'nullable|string',
            'municipalidad_id' => 'required|exists:municipalidad,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contacto = $this->contactoRepository->create($request->all());
        return response()->json(['data' => $contacto, 'message' => 'Contacto creado con éxito'], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nombre_contacto' => 'sometimes|string|max:255',
            'email' => 'nullable|email|max:255',
            'telefono_principal' => 'sometimes|string|max:20',
            'telefono_secundario' => 'nullable|string|max:20',
            'horario_atencion' => 'nullable|string|max:255',
            'direccion_fisica' => 'sometimes|string|max:255',
            'mapa_embed_url' => 'nullable|string',
            'municipalidad_id' => 'sometimes|exists:municipalidad,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $contacto = $this->contactoRepository->update($id, $request->all());
            return response()->json(['data' => $contacto, 'message' => 'Contacto actualizado con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Contacto no encontrado'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->contactoRepository->delete($id);
            return response()->json(['message' => 'Contacto eliminado con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Contacto no encontrado'], 404);
        }
    }

    public function getByMunicipalidadId($municipalidadId)
    {
        $contactos = $this->contactoRepository->getByMunicipalidadId($municipalidadId);
        return response()->json(['data' => $contactos], 200);
    }
}