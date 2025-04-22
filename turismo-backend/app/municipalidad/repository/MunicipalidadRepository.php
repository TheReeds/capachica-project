<?php

namespace App\municipalidad\Repository;

use App\municipalidad\Models\Municipalidad;

class MunicipalidadRepository
{
    public function all()
    {
        return Municipalidad::all();
    }

    public function find($id)
    {
        return Municipalidad::findOrFail($id);
    }

    public function create(array $data)
    {
        return Municipalidad::create($data);
    }

    public function update($id, array $data)
    {
        $municipalidad = Municipalidad::findOrFail($id);
        $municipalidad->update($data);
        return $municipalidad;
    }

    public function delete($id)
    {
        $municipalidad = Municipalidad::findOrFail($id);
        $municipalidad->delete();
        return true;
    }
}
