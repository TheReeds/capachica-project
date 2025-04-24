<?php
namespace App\reservas\reserva\Repository;

use App\reservas\reserva\Models\Reserva;

class ReservaRepository
{
    public function all()
    {
        return Reserva::all();
    }

    public function find($id)
    {
        return Reserva::findOrFail($id);
    }

    public function create(array $data)
    {
        return Reserva::create($data);
    }

    public function update($id, array $data)
    {
        $reserva = Reserva::findOrFail($id);
        $reserva->update($data);
        return $reserva;
    }

    public function delete($id)
    {
        return Reserva::destroy($id);
    }
}
