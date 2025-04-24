<?php
namespace App\reservas\reservadetalle\Repository;

use App\reservas\reservadetalle\Models\ReservaDetalle;

class ReservaDetalleRepository
{
    public function all()
    {
        return ReservaDetalle::all();
    }

    public function find($id)
    {
        return ReservaDetalle::findOrFail($id);
    }

    public function create(array $data)
    {
        return ReservaDetalle::create($data);
    }

    public function update($id, array $data)
    {
        $detalle = ReservaDetalle::findOrFail($id);
        $detalle->update($data);
        return $detalle;
    }

    public function delete($id)
    {
        return ReservaDetalle::destroy($id);
    }
}
