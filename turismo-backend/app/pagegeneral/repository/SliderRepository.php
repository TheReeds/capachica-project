<?php
namespace App\pagegeneral\repository;

use App\pagegeneral\models\Slider;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SliderRepository
{
    // ✅ Listar todos los sliders
    public static function listar()
    {
        return Slider::all(); // O puedes usar ->get()
    }

    // ✅ Obtener un slider por ID
    public static function obtenerPorId($id)
    {
        return Slider::findOrFail($id);
    }

    // ✅ Crear un nuevo slider
    public static function crear(array $data)
    {
        return Slider::create($data);
    }

    public static function actualizar($id, array $data)
    {
        $slider = Slider::findOrFail($id);
        $slider->update($data);
        return $slider;
    }

    // ✅ Eliminar un slider
    public static function eliminar($id)
    {
        $slider = Slider::findOrFail($id);
        return $slider->delete();
    }
}