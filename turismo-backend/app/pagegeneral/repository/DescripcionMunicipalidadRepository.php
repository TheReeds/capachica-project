<?php
namespace App\pagegeneral\repository;

use App\Models\DescripcionMunicipalidad;

class DescripcionMunicipalidadRepository
{
    protected $model;

    public function __construct(DescripcionMunicipalidad $descripcionMunicipalidad)
    {
        $this->model = $descripcionMunicipalidad;
    }

    public function getAll()
    {
        return $this->model->all();
    }

    public function getById($id)
    {
        return $this->model->findOrFail($id);
    }

    public function getByMunicipalidadId($municipalidadId)
    {
        return $this->model->where('municipalidad_id', $municipalidadId)->get();
    }

    public function getByTipo($tipo)
    {
        return $this->model->where('tipo', $tipo)->get();
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
}