<?php

namespace App\Servicios\Repository;

use App\Servicios\Models\Servicio;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ServicioRepository
{
    protected $model;

    public function __construct(Servicio $servicio)
    {
        $this->model = $servicio;
    }

    public function getAll(): Collection
    {
        return $this->model->with(['emprendedor', 'categorias'])->get();
    }

    public function getPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->with(['emprendedor', 'categorias'])->paginate($perPage);
    }

    public function findById(int $id): ?Servicio
    {
        return $this->model->with(['emprendedor', 'categorias'])->find($id);
    }

    public function create(array $data, array $categoriaIds = []): Servicio
    {
        $servicio = $this->model->create($data);
        
        if (!empty($categoriaIds)) {
            $servicio->categorias()->sync($categoriaIds);
        }
        
        return $servicio->load(['emprendedor', 'categorias']);
    }

    public function update(int $id, array $data, array $categoriaIds = []): bool
    {
        $servicio = $this->findById($id);
        if (!$servicio) {
            return false;
        }
        
        $updated = $servicio->update($data);
        
        if ($updated && !empty($categoriaIds)) {
            $servicio->categorias()->sync($categoriaIds);
        }
        
        return $updated;
    }

    public function delete(int $id): bool
    {
        $servicio = $this->findById($id);
        if (!$servicio) {
            return false;
        }
        
        return $servicio->delete();
    }

    public function getActiveServicios(): Collection
    {
        return $this->model->where('estado', true)
            ->with(['emprendedor', 'categorias'])
            ->get();
    }

    public function getServiciosByEmprendedor(int $emprendedorId): Collection
    {
        return $this->model->where('emprendedor_id', $emprendedorId)
            ->with('categorias')
            ->get();
    }

    public function getServiciosByCategoria(int $categoriaId): Collection
    {
        return $this->model->whereHas('categorias', function ($query) use ($categoriaId) {
            $query->where('categorias.id', $categoriaId);
        })->with(['emprendedor', 'categorias'])->get();
    }
}