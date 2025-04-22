<?php

namespace App\municipalidad\Controller;

use App\Http\Controllers\Controller;
use App\municipalidad\Repository\MunicipalidadRepository;
use Illuminate\Http\Request;

class MunicipalidadController extends Controller
{
    protected $repository;

    public function __construct(MunicipalidadRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        return response()->json($this->repository->all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'direccion' => 'nullable|string',
            'telefono' => 'nullable|string',
            'correo' => 'nullable|email'
        ]);

        $municipalidad = $this->repository->create($data);

        return response()->json($municipalidad, 201);
    }

    public function show($id)
    {
        return response()->json($this->repository->find($id));
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'direccion' => 'nullable|string',
            'telefono' => 'nullable|string',
            'correo' => 'nullable|email'
        ]);

        $municipalidad = $this->repository->update($id, $data);

        return response()->json($municipalidad);
    }

    public function destroy($id)
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}
