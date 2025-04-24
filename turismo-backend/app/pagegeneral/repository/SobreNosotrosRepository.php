<?php
namespace App\pagegeneral\repository;

use App\pagegeneral\Models\SobreNosotros;

class SobreNosotrosRepository
{
    protected $model;

    public function __construct(SobreNosotros $sobreNosotros)
    {
        $this->model = $sobreNosotros;
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
        return $this->model->where('municipalidad_id', $municipalidadId)->first();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $sobreNosotros = $this->getById($id);
        $sobreNosotros->update($data);
        return $sobreNosotros;
    }

    public function delete($id)
    {
        $sobreNosotros = $this->getById($id);
        return $sobreNosotros->delete();
    }
}