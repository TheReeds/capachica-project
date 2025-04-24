<?php

namespace App\Servicios\Repository;

use App\Servicios\Models\Emprendedor;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EmprendedorRepository
{
    protected $model;

    public function __construct(Emprendedor $emprendedor)
    {
        $this->model = $emprendedor;
    }

    public function getAll(): Collection
    {
        return $this->model->all();
    }

    public function getPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    public function findById(int $id): ?Emprendedor
    {
        return $this->model->find($id);
    }

    public function create(array $data): Emprendedor
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $emprendedor = $this->findById($id);
        if (!$emprendedor) {
            return false;
        }
        
        return $emprendedor->update($data);
    }

    public function delete(int $id): bool
    {
        $emprendedor = $this->findById($id);
        if (!$emprendedor) {
            return false;
        }
        
        return $emprendedor->delete();
    }

    public function getActiveEmprendedores(): Collection
    {
        return $this->model->where('estado', true)->get();
    }

    public function findWithServicios(int $id): ?Emprendedor
    {
        return $this->model->with('servicios')->find($id);
    }
}