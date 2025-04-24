<?php
namespace App\pagegeneral\repository;


use App\pagegeneral\Models\FotoDescripcion;

class FotoDescripcionRepository
{
    protected $model;

    public function __construct(FotoDescripcion $fotoDescripcion)
    {
        $this->model = $fotoDescripcion;
    }

    public function getAll()
    {
        return $this->model->all();
    }

    public function getById($id)
    {
        return $this->model->findOrFail($id);
    }

    public function getByDescripcionId($descripcionId)
    {
        return $this->model->where('descripcion_id', $descripcionId)->get();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $foto = $this->getById($id);
        $foto->update($data);
        return $foto;
    }

    public function delete($id)
    {
        $foto = $this->getById($id);
        return $foto->delete();
    }
}