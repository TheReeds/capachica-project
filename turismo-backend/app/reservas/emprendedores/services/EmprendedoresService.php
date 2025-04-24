<?php

namespace App\reservas\Emprendedores\Services;

use Illuminate\Support\Facades\DB;
use Exception;

use App\reservas\Emprendedores\Models\Emprendedor;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
//use Illuminate\Support\Facades\Log;

class EmprendedoresService
{
    /**
     * Obtener todos los emprendedores paginados
     */
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return Emprendedor::paginate($perPage);
    }

    /**
     * Obtener un emprendedor por su ID
     */
    public function getById(int $id): ?Emprendedor
    {
        return Emprendedor::find($id);
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
            
           /* Log::info('Intentando crear emprendedor:', $data);
            return Emprendedor::create($data);*/
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
            /*Log::error('Error al crear emprendedor: ' . $e->getMessage());
            throw $e; // o manejarlo como prefieras*/
        }
    }

    /**
     * Actualizar un emprendedor existente
     */
    public function update(int $id, array $data): ?Emprendedor
    {
        try{
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
        }catch(Exception $e){
            DB::rollBack();
            throw $e;
        }
        
        /*
        $emprendedor = $this->getById($id);

        if (!$emprendedor) {
            return null;
        }

        $emprendedor->update($data);
        return $emprendedor;*/
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
     * Buscar emprendedores por texto en nombre o descripción
     */
    public function search(string $query): Collection
    {
        return Emprendedor::where('nombre', 'like', "%{$query}%")
            ->orWhere('descripcion', 'like', "%{$query}%")
            ->get();
    }
}
