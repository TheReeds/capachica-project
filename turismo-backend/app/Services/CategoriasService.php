<?php

namespace App\Services;

use App\Models\Categoria;
use App\Repository\CategoriaRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Exception;
use Illuminate\Support\Facades\Log;

class CategoriasService
{
    protected $categoriaRepository;

    public function __construct(CategoriaRepository $categoriaRepository)
    {
        $this->categoriaRepository = $categoriaRepository;
    }

    /**
     * Obtener todas las categorías paginadas
     */
    public function getAll(array $filtros = [], int $perPage = 15): LengthAwarePaginator
    {
        try {
            return $this->categoriaRepository->getPaginated($filtros, $perPage);
        } catch (Exception $e) {
            Log::error('Error al obtener categorías: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obtener una categoría por ID
     */
    public function getById(int $id): ?Categoria
    {
        try {
            return $this->categoriaRepository->findById($id);
        } catch (Exception $e) {
            Log::error('Error al obtener categoría: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Crear una nueva categoría
     */
    public function create(array $data): Categoria
    {
        try {
            return $this->categoriaRepository->create($data);
        } catch (Exception $e) {
            Log::error('Error al crear categoría: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Actualizar una categoría existente
     */
    public function update(int $id, array $data): ?Categoria
    {
        try {
            return $this->categoriaRepository->update($id, $data);
        } catch (Exception $e) {
            Log::error('Error al actualizar categoría: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Eliminar una categoría
     */
    public function delete(int $id): bool
    {
        try {
            return $this->categoriaRepository->delete($id);
        } catch (Exception $e) {
            Log::error('Error al eliminar categoría: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Buscar categorías por término
     */
    public function buscar(string $termino): Collection
    {
        try {
            return $this->categoriaRepository->buscar($termino);
        } catch (Exception $e) {
            Log::error('Error al buscar categorías: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obtener categorías activas
     */
    public function getActivas(): Collection
    {
        try {
            return $this->categoriaRepository->getActivas();
        } catch (Exception $e) {
            Log::error('Error al obtener categorías activas: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obtener categorías con servicios
     */
    public function getConServicios(): Collection
    {
        try {
            return $this->categoriaRepository->getConServicios();
        } catch (Exception $e) {
            Log::error('Error al obtener categorías con servicios: ' . $e->getMessage());
            throw $e;
        }
    }
}
