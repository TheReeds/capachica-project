<?php
namespace App\pagegeneral\repository;

use App\pagegeneral\Models\Municipalidad;

class MunicipalidadRepository
{
    protected $model;

    public function __construct(Municipalidad $municipalidad)
    {
        $this->model = $municipalidad;
    }

    public function getAll()
    {
        return $this->model->all();
    }

    public function getById($id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $municipalidad = $this->getById($id);
        $municipalidad->update($data);
        return $municipalidad;
    }

    public function delete($id)
    {
        $municipalidad = $this->getById($id);
        return $municipalidad->delete();
    }

    public function getWithRelations($id)
    {
        return $this->model->with([
            'sliders', 
            'descripcionesMunicipalidad',
            'sobreNosotros',
            'contactos'
        ])->findOrFail($id);
    }

    public function getWithAsociaciones($id)
    {
        return $this->model->with('asociaciones')->findOrFail($id);
    }

    public function getWithAsociacionesAndEmprendedores($id)
    {
        return $this->model->with('asociaciones.emprendedores')->findOrFail($id);
    }

    // Nuevo método para obtener solo asociaciones sin emprendedores
    public function getWithAsociacionesBasic($id)
    {
        return $this->model->with(['asociaciones' => function($query) {
            $query->select('id', 'nombre', 'descripcion', 'municipalidad_id');
        }])->findOrFail($id);
    }
}