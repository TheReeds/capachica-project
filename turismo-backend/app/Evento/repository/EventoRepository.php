<?php
namespace App\Evento\Repository;

use App\Evento\Models\Evento;

class EventoRepository
{
    public function getAll()
    {
        return Evento::all();
    }

    public function getPaginated($perPage = 10)
    {
    return Evento::with('sliders')->paginate($perPage);
    }


    public function getById(int $id)
    {
        return Evento::with('sliders')->find($id);
    }

    public function create(array $data)
    {
    $slidersData = $data['sliders'] ?? [];
    unset($data['sliders']);

    $evento = Evento::create($data);

    if (!empty($slidersData)) {
        foreach ($slidersData as $slider) {
            $slider['entidad_id'] = $evento->id;
            $slider['tipo_entidad'] = 'evento';
            \App\Pagegeneral\Models\Slider::create($slider);
        }
    }

    return $evento->load('sliders');
    }


    public function update($id, array $data)
    {
        $evento = Evento::findOrFail($id);
        $evento->update($data);
        return $evento;
    }

    public function delete($id)
    {
        return Evento::destroy($id);
    }
}
