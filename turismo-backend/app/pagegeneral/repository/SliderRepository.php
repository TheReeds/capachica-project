<?php
namespace App\pagegeneral\repository;

use App\pagegeneral\models\Slider;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SliderRepository
{
    protected $model;

    public function __construct(Slider $slider)
    {
        $this->model = $slider;
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
        $slider = $this->getById($id);
        $slider->update($data);
        return $slider;
    }

    public function delete($id)
    {
        $slider = $this->getById($id);
        return $slider->delete();
    }

    public function getWithDescripciones($id)
    {
        return $this->model->with('descripciones')->findOrFail($id);
    }
}