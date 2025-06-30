<?php

namespace App\Repository;

use App\Models\Categoria;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoriaRepository
{
    protected $model;

    public function __construct(Categoria $categoria)
    {
        $this->model = $categoria;
    }

    public function getAll(): Collection
    {
        return $this->model->all();
    }

    public function getPaginated(array $filtros = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query();

        // Aplicar filtros si existen
        if (!empty($filtros['buscar'])) {
            $query->where('nombre', 'like', '%' . $filtros['buscar'] . '%')
                  ->orWhere('descripcion', 'like', '%' . $filtros['buscar'] . '%');
        }

        // Removido filtro de estado ya que no existe la columna

        return $query->paginate($perPage);
    }

    public function findById(int $id): ?Categoria
    {
        return $this->model->find($id);
    }

    public function create(array $data): Categoria
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Categoria
    {
        $categoria = $this->findById($id);
        if (!$categoria) {
            return null;
        }

        $categoria->update($data);
        return $categoria->fresh();
    }

    public function delete(int $id): bool
    {
        $categoria = $this->findById($id);
        if (!$categoria) {
            return false;
        }

        return $categoria->delete();
    }

    public function findWithServicios(int $id): ?Categoria
    {
        return $this->model->with('servicios')->find($id);
    }

    public function buscar(string $termino): Collection
    {
        return $this->model->where('nombre', 'like', '%' . $termino . '%')
                          ->orWhere('descripcion', 'like', '%' . $termino . '%')
                          ->get();
    }

    public function getActivas(): Collection
    {
        // Como la tabla categorias no tiene columna estado, devolvemos todas
        return $this->model->all();
    }

    public function getConServicios(): Collection
    {
        return $this->model->has('servicios')->get();
    }
}
