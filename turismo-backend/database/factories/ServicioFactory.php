<?php

namespace Database\Factories;

use App\Models\Servicio;
use App\Models\Emprendedor;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServicioFactory extends Factory
{
    protected $model = Servicio::class;

    public function definition()
    {
        return [
            'nombre' => $this->faker->sentence(3),
            'descripcion' => $this->faker->paragraph(),
            'precio_referencial' => $this->faker->randomFloat(2, 10, 500),
            'emprendedor_id' => Emprendedor::factory(),
            'estado' => $this->faker->boolean(80), // 80% probabilidad de estar activo
            'capacidad' => $this->faker->numberBetween(1, 50),
            'latitud' => $this->faker->latitude(),
            'longitud' => $this->faker->longitude(),
            'ubicacion_referencia' => $this->faker->address(),
        ];
    }

    /**
     * Indica que el servicio está activo
     */
    public function activo()
    {
        return $this->state(function (array $attributes) {
            return [
                'estado' => true,
            ];
        });
    }

    /**
     * Indica que el servicio está inactivo
     */
    public function inactivo()
    {
        return $this->state(function (array $attributes) {
            return [
                'estado' => false,
            ];
        });
    }
}
