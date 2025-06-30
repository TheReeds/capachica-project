<?php

namespace Tests\Unit\Models;

use App\Models\Evento;
use App\Models\Emprendedor;
use App\Models\Slider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class EventoTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    #[Test]
    public function puede_crear_evento_con_datos_validos()
    {
        // Arrange
        $emprendedor = Emprendedor::factory()->create();

        $data = [
            'nombre' => $this->faker->sentence(3),
            'descripcion' => $this->faker->paragraph,
            'tipo_evento' => 'taller',
            'idioma_principal' => 'es',
            'fecha_inicio' => '2025-07-01',
            'hora_inicio' => '10:00:00',
            'fecha_fin' => '2025-07-01',
            'hora_fin' => '13:00:00',
            'duracion_horas' => 3,
            'coordenada_x' => $this->faker->latitude,
            'coordenada_y' => $this->faker->longitude,
            'id_emprendedor' => $emprendedor->id,
            'que_llevar' => 'Laptop y cuaderno',
        ];

        // Act
        $evento = Evento::create($data);

        // Assert
        $this->assertInstanceOf(Evento::class, $evento);
        foreach ($data as $campo => $valor) {
            $this->assertEquals($valor, $evento->{$campo});
        }
        $this->assertDatabaseHas('eventos', $data);
    }

    #[Test]
    public function fillable_permite_campos_correctos()
    {
        // Arrange
        $evento = new Evento();
        $data = [
            'nombre' => 'Nombre Evento',
            'descripcion' => 'Descripción corta',
            'tipo_evento' => 'conferencia',
            'idioma_principal' => 'es',
            'campo_no_permitido' => 'no debe asignarse',
        ];

        // Act
        $evento->fill($data);

        // Assert
        $this->assertEquals('Nombre Evento', $evento->nombre);
        $this->assertEquals('Descripción corta', $evento->descripcion);
        $this->assertEquals('conferencia', $evento->tipo_evento);
        $this->assertEquals('es', $evento->idioma_principal);
        $this->assertNull($evento->campo_no_permitido);
    }

    #[Test]
    public function relacion_emprendedor_funciona_correctamente()
    {
        // Arrange
        $emprendedor = Emprendedor::factory()->create();
        $evento = Evento::factory()->create(['id_emprendedor' => $emprendedor->id]);

        // Act & Assert
        $this->assertInstanceOf(Emprendedor::class, $evento->emprendedor);
        $this->assertEquals($emprendedor->id, $evento->emprendedor->id);
    }

    #[Test]
    public function relacion_sliders_filtra_por_evento_y_orden()
    {
        // Arrange
        $evento = Evento::factory()->create();

        $sliderEvento2 = Slider::factory()->create([
            'entidad_id'  => $evento->id,
            'tipo_entidad' => 'evento',
            'orden'       => 2,
        ]);
        $sliderEvento1 = Slider::factory()->create([
            'entidad_id'  => $evento->id,
            'tipo_entidad' => 'evento',
            'orden'       => 1,
        ]);
        $sliderOtro = Slider::factory()->create([
            'entidad_id'  => $evento->id,
            'tipo_entidad' => 'otro',
            'orden'       => 3,
        ]);

        // Act
        $sliders = $evento->sliders;

        // Assert
        $this->assertCount(2, $sliders);
        $this->assertEquals([
            $sliderEvento1->id,
            $sliderEvento2->id,
        ], $sliders->pluck('id')->toArray());
        $this->assertFalse($sliders->contains('id', $sliderOtro->id));
    }

    #[Test]
    public function tabla_correcta_es_utilizada()
    {
        $evento = new Evento();
        $this->assertEquals('eventos', $evento->getTable());
    }

    #[Test]
    public function primary_key_es_id_por_defecto()
    {
        $evento = new Evento();
        $this->assertEquals('id', $evento->getKeyName());
    }

    #[Test]
    public function timestamps_estan_habilitados()
    {
        $evento = new Evento();
        $this->assertTrue($evento->usesTimestamps());
    }

    #[Test]
    public function created_at_y_updated_at_se_establecen_automaticamente()
    {
        // Arrange & Act
        $evento = Evento::factory()->create();

        // Assert
        $this->assertNotNull($evento->created_at);
        $this->assertNotNull($evento->updated_at);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $evento->created_at);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $evento->updated_at);
    }

    #[Test]
    public function puede_buscar_eventos_por_tipo()
    {
        // Arrange
        $taller = Evento::factory()->create(['tipo_evento' => 'taller']);
        $conferencia = Evento::factory()->create(['tipo_evento' => 'conferencia']);

        // Act
        $resultado = Evento::where('tipo_evento', 'taller')->get();

        // Assert
        $this->assertCount(1, $resultado);
        $this->assertTrue($resultado->contains('id', $taller->id));
        $this->assertFalse($resultado->contains('id', $conferencia->id));
    }
}
