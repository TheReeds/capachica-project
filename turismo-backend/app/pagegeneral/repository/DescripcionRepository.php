<?php
namespace App\pagegeneral\repository;


use App\pagegeneral\Models\Descripcion;


class DescripcionRepository
{
    protected $model;

    public function __construct(Descripcion $descripcion)
    {
        $this->model = $descripcion;
    }

    public function getAll()
    {
        return $this->model->all();
    }

    public function getById($id)
    {
        return $this->model->findOrFail($id);
    }

    public function getBySliderId($sliderId)
    {
        return $this->model->where('slider_id', $sliderId)->get();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $descripcion = $this->getById($id);
        $descripcion->update($data);
        return $descripcion;
    }

    public function delete($id)
    {
        $descripcion = $this->getById($id);
        return $descripcion->delete();
    }

    public function getWithFotos($id)
    {
        return $this->model->with('fotosDescripcion')->findOrFail($id);
    }
}