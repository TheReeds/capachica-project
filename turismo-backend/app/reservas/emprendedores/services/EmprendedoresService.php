<?php

namespace App\reservas\Emprendedores\Services;

use Illuminate\Support\Facades\DB;
use Exception;

use App\reservas\Emprendedores\Models\Emprendedor;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EmprendedoresService
{
    /**
     * Obtener todos los emprendedores paginados
     */
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return Emprendedor::with('asociacion')->paginate($perPage);
    }

    /**
     * Obtener un emprendedor por su ID
     */
    public function getById(int $id): ?Emprendedor
    {
        return Emprendedor::with(['asociacion', 'servicios'])->find($id);
    }

    /**
     * Crear un nuevo emprendedor
     */
    public function create(array $data): Emprendedor
    {
        try {
            DB::beginTransaction();

            $emprendedor = new Emprendedor();
            $emprendedor->fill($data);
            
            if (!$emprendedor->save()) {
                throw new Exception('Error al guardar el registro en la base de datos');
            }
            
            DB::commit();
            return $emprendedor;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Actualizar un emprendedor existente
     */
    public function update(int $id, array $data): ?Emprendedor
    {
        try {
            DB::beginTransaction();
            
            $emprendedor = Emprendedor::find($id);
            
            if (!$emprendedor) {
                DB::rollBack();
                return null;
            }
            
            $emprendedor->fill($data);
            
            if (!$emprendedor->save()) {
                throw new Exception('Error al actualizar el registro en la base de datos');
            }
            
            DB::commit();
            return $emprendedor;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Eliminar un emprendedor
     */
    public function delete(int $id): bool
    {
        $emprendedor = $this->getById($id);

        if (!$emprendedor) {
            return false;
        }

        return $emprendedor->delete();
    }

    /**
     * Buscar emprendedores por categoría
     */
    public function findByCategory(string $categoria): Collection
    {
        return Emprendedor::where('categoria', $categoria)->get();
    }

    /**
     * Buscar emprendedores por asociación
     */
    public function findByAsociacion(int $asociacionId): Collection
    {
        return Emprendedor::where('asociacion_id', $asociacionId)->get();
    }

    /**
     * Buscar emprendedores por texto en nombre o descripción
     */
    public function search(string $query): Collection
    {
        return Emprendedor::where('nombre', 'like', "%{$query}%")
            ->orWhere('descripcion', 'like', "%{$query}%")
            ->get();
    }
}