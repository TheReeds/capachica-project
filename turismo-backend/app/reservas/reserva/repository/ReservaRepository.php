<?php
namespace App\reservas\reserva\Repository;

use App\reservas\reserva\Models\Reserva;

class ReservaRepository
{
    /**
     * Obtener todas las reservas
     */
    public function all()
    {
        return Reserva::all();
    }

    /**
     * Encontrar una reserva por su ID
     */
    public function find($id)
    {
        return Reserva::findOrFail($id);
    }

    /**
     * Encontrar una reserva con sus emprendedores
     */
    public function findWithEmprendedores($id)
    {
        return Reserva::with('emprendedores')->findOrFail($id);
    }

    /**
     * Crear una nueva reserva
     */
    public function create(array $data)
    {
        return Reserva::create($data);
    }

    /**
     * Actualizar una reserva existente
     */
    public function update($id, array $data)
    {
        $reserva = Reserva::findOrFail($id);
        $reserva->update($data);
        return $reserva;
    }

    /**
     * Eliminar una reserva
     */
    public function delete($id)
    {
        return Reserva::destroy($id);
    }

    /**
     * Obtener reservas por tipo
     */
    public function getByTipo($tipo)
    {
        return Reserva::where('tipo', $tipo)->get();
    }

    /**
     * Obtener reservas por fecha
     */
    public function getByFecha($fecha)
    {
        return Reserva::whereDate('fecha', $fecha)->get();
    }

    /**
     * Obtener reservas por rango de fechas
     */
    public function getByRangoFechas($fechaInicio, $fechaFin)
    {
        return Reserva::whereBetween('fecha', [$fechaInicio, $fechaFin])->get();
    }
}