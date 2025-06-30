<?php

namespace App\Services;

use App\Models\Asociacion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Exception;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class AsociacionesService
{
    // Aquí va la implementación original, si la había. Si estaba vacío, dejarlo así.

    public function getAll($perPage = 15)
    {
        return Asociacion::with('municipalidad')->paginate($perPage);
    }

    public function getById($id)
    {
        return Asociacion::with('municipalidad')->find($id);
    }

    public function create(array $data)
    {
        return Asociacion::create($data);
    }

    public function update($id, array $data)
    {
        $asociacion = Asociacion::find($id);
        if ($asociacion) {
            $asociacion->update($data);
        }
        return $asociacion;
    }

    public function delete($id)
    {
        $asociacion = Asociacion::find($id);
        if ($asociacion) {
            return $asociacion->delete();
        }
        return false;
    }

    public function getWithEmprendedores($id)
    {
        return Asociacion::with('emprendedores')->find($id);
    }

    public function getByMunicipalidad($municipalidadId)
    {
        return Asociacion::where('municipalidad_id', $municipalidadId)->get();
    }
}