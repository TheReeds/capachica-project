<?php
namespace App\pagegeneral\repository;

use App\pagegeneral\Models\Contacto;

class ContactoRepository
{
    protected $model;

    public function __construct(Contacto $contacto)
    {
        $this->model = $contacto;
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

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $contacto = $this->getById($id);
        $contacto->update($data);
        return $contacto;
    }

    public function delete($id)
    {
        $contacto = $this->getById($id);
        return $contacto->delete();
    }
}