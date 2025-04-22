<?php
namespace App\bussinespage\controller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\bussinespage\models\Docente;

class DocenteController extends Controller
{
    public function index()
    {
        return response()->json(Docente::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'apellido' => 'required|string',
            'email' => 'required|email|unique:docentes,email',
            'especialidad' => 'required|string',
        ]);

        $docente = Docente::create($validated);
        return response()->json($docente, 201);
    }

    public function show($id)
    {
        $docente = Docente::find($id);
        if (!$docente) {
            return response()->json(['message' => 'No encontrado'], 404);
        }
        return response()->json($docente, 200);
    }

    public function update(Request $request, $id)
    {
        $docente = Docente::find($id);
        if (!$docente) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'nombre' => 'string',
            'apellido' => 'string',
            'email' => 'email|unique:docentes,email,' . $id,
            'especialidad' => 'string',
        ]);

        $docente->update($validated);
        return response()->json($docente, 200);
    }

    public function destroy($id)
    {
        $docente = Docente::find($id);
        if (!$docente) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        $docente->delete();
        return response()->json(['message' => 'Eliminado correctamente'], 200);
    }
}
