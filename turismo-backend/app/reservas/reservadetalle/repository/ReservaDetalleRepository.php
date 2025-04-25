<?php
namespace App\reservas\reservadetalle\Repository;

use App\reservas\reservadetalle\Models\ReservaDetalle;

class ReservaDetalleRepository
{
    /**
     * Obtener todos los detalles de reserva
     */
    public function all()
    {
        return ReservaDetalle::with(['reserva', 'emprendedor'])->get();
    }

    /**
     * Encontrar un detalle de reserva por su ID
     */
    public function find($id)
    {
        return ReservaDetalle::with(['reserva', 'emprendedor'])->findOrFail($id);
    }

    /**
     * Crear un nuevo detalle de reserva
     */
    public function create(array $data)
    {
        return ReservaDetalle::create($data);
    }

    /**
     * Actualizar un detalle de reserva existente
     */
    public function update($id, array $data)
    {
        $detalle = ReservaDetalle::findOrFail($id);
        $detalle->update($data);
        return $detalle;
    }

    /**
     * Eliminar un detalle de reserva
     */
    public function delete($id)
    {
        return ReservaDetalle::destroy($id);
    }

    /**
     * Obtener detalles por reserva
     */
    public function getByReserva($reservaId)
    {
        return ReservaDetalle::where('reserva_id', $reservaId)
                            ->with('emprendedor')
                            ->get();
    }

    /**
     * Obtener detalles por emprendedor
     */
    public function getByEmprendedor($emprendedorId)
    {
        return ReservaDetalle::where('emprendedor_id', $emprendedorId)
                            ->with('reserva')
                            ->get();
    }
}