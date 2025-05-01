<?php

namespace App\reservas\Emprendedores\Services;

use Illuminate\Support\Facades\DB;
use Exception;

use App\reservas\Emprendedores\Models\Emprendedor;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Pagegeneral\Repository\SliderRepository;
use App\Pagegeneral\Models\SliderDescripcion;

class EmprendedoresService
{
    protected $sliderRepository;

    public function __construct(SliderRepository $sliderRepository = null)
    {
        $this->sliderRepository = $sliderRepository ?: app(SliderRepository::class);
    }

    /**
     * Obtener todos los emprendedores paginados
     */
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return Emprendedor::with('asociacion')->paginate($perPage);
    }

    /**
     * Obtener un emprendedor por su ID
     */
    public function getById(int $id): ?Emprendedor
    {
        return Emprendedor::with(['asociacion', 'servicios'])->find($id);
    }

    /**
     * Crear un nuevo emprendedor
     */
    public function create(array $data): Emprendedor
    {
        try {
            DB::beginTransaction();

            // Extraer datos de sliders si existen
            $slidersPrincipales = $data['sliders_principales'] ?? [];
            $slidersSecundarios = $data['sliders_secundarios'] ?? [];
            
            // Eliminar datos de sliders del array principal
            unset($data['sliders_principales']);
            unset($data['sliders_secundarios']);

            $emprendedor = new Emprendedor();
            $emprendedor->fill($data);
            
            if (!$emprendedor->save()) {
                throw new Exception('Error al guardar el registro en la base de datos');
            }
            
            // Crear sliders principales si existen
            if (!empty($slidersPrincipales)) {
                foreach ($slidersPrincipales as &$slider) {
                    $slider['es_principal'] = true;
                }
                $this->sliderRepository->createMultiple('emprendedor', $emprendedor->id, $slidersPrincipales);
            }
            
            // Crear sliders secundarios si existen
            if (!empty($slidersSecundarios)) {
                foreach ($slidersSecundarios as &$slider) {
                    $slider['es_principal'] = false;
                }
                $this->sliderRepository->createMultiple('emprendedor', $emprendedor->id, $slidersSecundarios);
            }
            
            DB::commit();
            return $emprendedor->fresh(['slidersPrincipales', 'slidersSecundarios']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update(int $id, array $data): ?Emprendedor
    {
        try {
            DB::beginTransaction();
            
            $emprendedor = Emprendedor::find($id);
            
            if (!$emprendedor) {
                DB::rollBack();
                return null;
            }
            
            // Extraer datos de sliders si existen
            $slidersPrincipales = $data['sliders_principales'] ?? [];
            $slidersSecundarios = $data['sliders_secundarios'] ?? [];
            $deletedSliderIds = $data['deleted_sliders'] ?? [];
            
            // Eliminar datos de sliders del array principal
            unset($data['sliders_principales']);
            unset($data['sliders_secundarios']);
            unset($data['deleted_sliders']);
            
            $emprendedor->fill($data);
            
            if (!$emprendedor->save()) {
                throw new Exception('Error al actualizar el registro en la base de datos');
            }
            
            // Eliminar sliders marcados para eliminación
            if (!empty($deletedSliderIds)) {
                foreach ($deletedSliderIds as $sliderId) {
                    $this->sliderRepository->delete((int)$sliderId);
                }
            }
            
            // Actualizar sliders principales si existen
            if (!empty($slidersPrincipales)) {
                foreach ($slidersPrincipales as &$slider) {
                    $slider['es_principal'] = true;
                }
                $this->sliderRepository->updateEntitySliders('emprendedor', $emprendedor->id, $slidersPrincipales);
            }
            
            // Actualizar sliders secundarios si existen
            if (!empty($slidersSecundarios)) {
                foreach ($slidersSecundarios as &$slider) {
                    $slider['es_principal'] = false;
                }
                $this->sliderRepository->updateEntitySliders('emprendedor', $emprendedor->id, $slidersSecundarios);
            }
            
            DB::commit();
            return $emprendedor->fresh(['slidersPrincipales', 'slidersSecundarios']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    /**
     * Eliminar un emprendedor
     */
    public function delete(int $id): bool
    {
        try {
            DB::beginTransaction();
            
            $emprendedor = Emprendedor::with(['sliders'])->find($id);

            if (!$emprendedor) {
                DB::rollBack();
                return false;
            }

            // Eliminar sliders asociados
            $emprendedor->sliders->each(function ($slider) {
                $this->sliderRepository->delete($slider->id);
            });
            
            // Eliminar el emprendedor
            $deleted = $emprendedor->delete();
            
            DB::commit();
            return $deleted;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    /**
     * Buscar emprendedores por categoría
     */
    public function findByCategory(string $categoria): Collection
    {
        return Emprendedor::where('categoria', $categoria)->get();
    }

    /**
     * Buscar emprendedores por asociación
     */
    public function findByAsociacion(int $asociacionId): Collection
    {
        return Emprendedor::where('asociacion_id', $asociacionId)->get();
    }

    /**
     * Buscar emprendedores por texto en nombre o descripción
     */
    public function search(string $query): Collection
    {
        return Emprendedor::where('nombre', 'like', "%{$query}%")
            ->orWhere('descripcion', 'like', "%{$query}%")
            ->get();
    }
    public function getWithRelations(int $id): ?Emprendedor
    {
        return Emprendedor::with([
            'asociacion',
            'servicios',
            'slidersPrincipales',
            'slidersSecundarios',
            'slidersSecundarios.descripcion',
            'reservas'
        ])->find($id);
    }
}