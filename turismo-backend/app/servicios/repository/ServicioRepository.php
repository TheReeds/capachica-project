<?php

namespace App\Servicios\Repository;

use App\Servicios\Models\Servicio;
use Illuminate\Database\Eloquent\Collection;
use App\Pagegeneral\Repository\SliderRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ServicioRepository
{
    protected $model;
    protected $sliderRepository;

    public function __construct(Servicio $servicio, SliderRepository $sliderRepository = null)
    {
        $this->model = $servicio;
        $this->sliderRepository = $sliderRepository ?: app(SliderRepository::class);
    }

    public function getAll(): Collection
    {
        return $this->model->with(['emprendedor', 'categorias'])->get();
    }

    public function getPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->with(['emprendedor', 'categorias'])->paginate($perPage);
    }

    public function findById(int $id): ?Servicio
    {
        return $this->model->with(['emprendedor', 'categorias'])->find($id);
    }

    public function create(array $data, array $categoriaIds = []): Servicio
    {
        try {
            DB::beginTransaction();
            
            // Extraer datos de sliders si existen
            $sliders = $data['sliders'] ?? [];
            
            // Eliminar datos de sliders del array principal
            unset($data['sliders']);
            
            $servicio = $this->model->create($data);
            
            if (!empty($categoriaIds)) {
                $servicio->categorias()->sync($categoriaIds);
            }
            
            // Crear sliders si existen
            if (!empty($sliders)) {
                // Agregar es_principal a cada slider si no está definido
                foreach ($sliders as &$slider) {
                    if (!isset($slider['es_principal'])) {
                        $slider['es_principal'] = true; // valor predeterminado
                    }
                }
                $this->sliderRepository->createMultiple('servicio', $servicio->id, $sliders);
            }
            
            DB::commit();
            return $servicio->fresh(['emprendedor', 'categorias', 'sliders']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update(int $id, array $data, array $categoriaIds = []): bool
    {
        try {
            DB::beginTransaction();
            
            $servicio = $this->findById($id);
            if (!$servicio) {
                DB::rollBack();
                return false;
            }
            
            // Extraer datos de sliders si existen
            $sliders = $data['sliders'] ?? [];
            $deletedSliderIds = $data['deleted_sliders'] ?? [];
            
            // Eliminar datos de sliders del array principal
            unset($data['sliders']);
            unset($data['deleted_sliders']);
            
            $updated = $servicio->update($data);
            
            if ($updated && !empty($categoriaIds)) {
                $servicio->categorias()->sync($categoriaIds);
            }
            
            // Eliminar sliders especificados
            if (!empty($deletedSliderIds)) {
                foreach ($deletedSliderIds as $sliderId) {
                    $this->sliderRepository->delete($sliderId);
                }
            }
            
            // Actualizar sliders si existen
            if (!empty($sliders)) {
                $this->sliderRepository->updateEntitySliders('servicio', $servicio->id, $sliders);
            }
            
            DB::commit();
            return $updated;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete(int $id): bool
    {
        try {
            DB::beginTransaction();
            
            $servicio = $this->findById($id);
            if (!$servicio) {
                DB::rollBack();
                return false;
            }
            
            // Eliminar sliders asociados
            $servicio->sliders->each(function ($slider) {
                app(SliderRepository::class)->delete($slider->id);
            });
            
            $deleted = $servicio->delete();
            
            DB::commit();
            return $deleted;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getActiveServicios(): Collection
    {
        return $this->model->where('estado', true)
            ->with(['emprendedor', 'categorias'])
            ->get();
    }

    public function getServiciosByEmprendedor(int $emprendedorId): Collection
    {
        return $this->model->where('emprendedor_id', $emprendedorId)
            ->with('categorias')
            ->get();
    }

    public function getServiciosByCategoria(int $categoriaId): Collection
    {
        return $this->model->whereHas('categorias', function ($query) use ($categoriaId) {
            $query->where('categorias.id', $categoriaId);
        })->with(['emprendedor', 'categorias'])->get();
    }
}