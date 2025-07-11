<?php

namespace Tests\Unit\Models;

use App\Models\Reserva;
use App\Models\ReservaServicio;
use App\Models\User;
use App\Models\Servicio;
use App\Models\Emprendedor;
use App\Models\Asociacion;
use App\Models\Municipalidad;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Carbon\Carbon;

class ReservaTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $usuario;
    protected Emprendedor $emprendedor;
    protected Servicio $servicio;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Crear estructura básica
        $this->usuario = User::factory()->create();
        
        $municipalidad = Municipalidad::factory()->create();
        $asociacion = Asociacion::factory()->create(['municipalidad_id' => $municipalidad->id]);
        $this->emprendedor = Emprendedor::factory()->create(['asociacion_id' => $asociacion->id]);
        $this->servicio = Servicio::factory()->create(['emprendedor_id' => $this->emprendedor->id]);
    }

    #[Test]
    public function puede_crear_reserva_con_datos_validos()
    {
        // Arrange
        $data = [
            'usuario_id' => $this->usuario->id,
            'codigo_reserva' => 'ABC123240801',
            'estado' => Reserva::ESTADO_PENDIENTE,
            'notas' => 'Reserva para viaje familiar al Lago Titicaca'
        ];

        // Act
        $reserva = Reserva::create($data);

        // Assert
        $this->assertInstanceOf(Reserva::class, $reserva);
        $this->assertEquals($data['usuario_id'], $reserva->usuario_id);
        $this->assertEquals($data['codigo_reserva'], $reserva->codigo_reserva);
        $this->assertEquals($data['estado'], $reserva->estado);
        $this->assertEquals($data['notas'], $reserva->notas);
        
        $this->assertDatabaseHas('reservas', [
            'usuario_id' => $this->usuario->id,
            'codigo_reserva' => $data['codigo_reserva'],
            'estado' => $data['estado']
        ]);
    }

    #[Test]
    public function fillable_permite_campos_correctos()
    {
        // Arrange
        $reserva = new Reserva();
        $data = [
            'usuario_id' => $this->usuario->id,
            'codigo_reserva' => 'TEST123',
            'estado' => Reserva::ESTADO_CONFIRMADA,
            'notas' => 'Notas de prueba',
            'campo_no_permitido' => 'no debe ser asignado'
        ];

        // Act
        $reserva->fill($data);

        // Assert
        $this->assertEquals($this->usuario->id, $reserva->usuario_id);
        $this->assertEquals('TEST123', $reserva->codigo_reserva);
        $this->assertEquals(Reserva::ESTADO_CONFIRMADA, $reserva->estado);
        $this->assertEquals('Notas de prueba', $reserva->notas);
        $this->assertNull($reserva->campo_no_permitido);
    }

    #[Test]
    public function constantes_de_estado_estan_definidas()
    {
        // Assert
        $this->assertEquals('en_carrito', Reserva::ESTADO_EN_CARRITO);
        $this->assertEquals('pendiente', Reserva::ESTADO_PENDIENTE);
        $this->assertEquals('confirmada', Reserva::ESTADO_CONFIRMADA);
        $this->assertEquals('cancelada', Reserva::ESTADO_CANCELADA);
        $this->assertEquals('completada', Reserva::ESTADO_COMPLETADA);
    }

    #[Test]
    public function relacion_usuario_funciona_correctamente()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);

        // Act
        $usuarioRelacionado = $reserva->usuario;

        // Assert
        $this->assertInstanceOf(User::class, $usuarioRelacionado);
        $this->assertEquals($this->usuario->id, $usuarioRelacionado->id);
        $this->assertEquals($this->usuario->name, $usuarioRelacionado->name);
        $this->assertEquals($this->usuario->email, $usuarioRelacionado->email);
    }

    #[Test]
    public function relacion_servicios_funciona_correctamente()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);
        
        $serviciosReservados = ReservaServicio::factory()->count(3)->create([
            'reserva_id' => $reserva->id,
            'servicio_id' => $this->servicio->id,
            'emprendedor_id' => $this->emprendedor->id
        ]);

        // Act
        $serviciosRelacionados = $reserva->servicios;

        // Assert
        $this->assertCount(3, $serviciosRelacionados);
        foreach ($serviciosReservados as $servicioReservado) {
            $this->assertTrue(
                $serviciosRelacionados->contains('id', $servicioReservado->id)
            );
        }
    }

    #[Test]
    public function puede_generar_codigo_reserva_unico()
    {
        // Act
        $codigo1 = Reserva::generarCodigoReserva();
        $codigo2 = Reserva::generarCodigoReserva();

        // Assert
        $this->assertIsString($codigo1);
        $this->assertIsString($codigo2);
        $this->assertNotEquals($codigo1, $codigo2);
        
        // Verificar formato: 6 caracteres + fecha (YYMMDD)
        $this->assertMatchesRegularExpression('/^[A-Z0-9]{6}\d{6}$/', $codigo1);
        $this->assertMatchesRegularExpression('/^[A-Z0-9]{6}\d{6}$/', $codigo2);
        
        // Verificar que incluye la fecha actual
        $fechaActual = date('ymd');
        $this->assertStringEndsWith($fechaActual, $codigo1);
        $this->assertStringEndsWith($fechaActual, $codigo2);
    }

    #[Test]
    public function codigo_reserva_no_se_repite()
    {
        // Arrange - Crear reserva con código específico
        $codigoExistente = 'ABC123' . date('ymd');
        Reserva::factory()->create([
            'usuario_id' => $this->usuario->id,
            'codigo_reserva' => $codigoExistente
        ]);

        // Act - Generar nuevos códigos
        $codigos = [];
        for ($i = 0; $i < 10; $i++) {
            $codigos[] = Reserva::generarCodigoReserva();
        }

        // Assert
        $this->assertNotContains($codigoExistente, $codigos);
        $this->assertEquals(count($codigos), count(array_unique($codigos))); // Todos únicos
    }

    #[Test]
    public function atributo_total_servicios_calcula_correctamente()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);
        
        ReservaServicio::factory()->count(4)->create([
            'reserva_id' => $reserva->id,
            'servicio_id' => $this->servicio->id,
            'emprendedor_id' => $this->emprendedor->id
        ]);

        // Act
        $totalServicios = $reserva->total_servicios;

        // Assert
        $this->assertEquals(4, $totalServicios);
    }

    #[Test]
    public function atributo_fecha_inicio_obtiene_primer_servicio()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);
        
        ReservaServicio::factory()->create([
            'reserva_id' => $reserva->id,
            'servicio_id' => $this->servicio->id,
            'emprendedor_id' => $this->emprendedor->id,
            'fecha_inicio' => '2024-08-20'
        ]);
        
        ReservaServicio::factory()->create([
            'reserva_id' => $reserva->id,
            'servicio_id' => $this->servicio->id,
            'emprendedor_id' => $this->emprendedor->id,
            'fecha_inicio' => '2024-08-15' // Primera fecha
        ]);

        // Act
        $fechaInicio = $reserva->fecha_inicio;

        // Assert
        $this->assertEquals('2024-08-15', $fechaInicio);
    }

    #[Test]
    public function atributo_fecha_fin_obtiene_ultimo_servicio()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);
        
        ReservaServicio::factory()->create([
            'reserva_id' => $reserva->id,
            'servicio_id' => $this->servicio->id,
            'emprendedor_id' => $this->emprendedor->id,
            'fecha_inicio' => '2024-08-15',
            'fecha_fin' => '2024-08-17'
        ]);
        
        ReservaServicio::factory()->create([
            'reserva_id' => $reserva->id,
            'servicio_id' => $this->servicio->id,
            'emprendedor_id' => $this->emprendedor->id,
            'fecha_inicio' => '2024-08-18',
            'fecha_fin' => '2024-08-25' // Última fecha
        ]);

        // Act
        $fechaFin = $reserva->fecha_fin;

        // Assert
        $this->assertEquals('2024-08-25', $fechaFin);
    }

    #[Test]
    public function atributo_fecha_fin_usa_fecha_inicio_si_no_hay_fecha_fin()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);
        
        ReservaServicio::factory()->create([
            'reserva_id' => $reserva->id,
            'servicio_id' => $this->servicio->id,
            'emprendedor_id' => $this->emprendedor->id,
            'fecha_inicio' => '2024-08-15',
            'fecha_fin' => null
        ]);

        // Act
        $fechaFin = $reserva->fecha_fin;

        // Assert
        $this->assertEquals('2024-08-15', $fechaFin);
    }

    #[Test]
    public function atributo_precio_total_calcula_correctamente()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);
        
        ReservaServicio::factory()->create([
            'reserva_id' => $reserva->id,
            'servicio_id' => $this->servicio->id,
            'emprendedor_id' => $this->emprendedor->id,
            'precio' => 100.00,
            'cantidad' => 2
        ]);
        
        ReservaServicio::factory()->create([
            'reserva_id' => $reserva->id,
            'servicio_id' => $this->servicio->id,
            'emprendedor_id' => $this->emprendedor->id,
            'precio' => 75.50,
            'cantidad' => 1
        ]);

        // Act
        $precioTotal = $reserva->precio_total;

        // Assert
        $this->assertEquals(275.50, $precioTotal); // (100 * 2) + (75.50 * 1)
    }

    #[Test]
    public function atributo_precio_total_maneja_valores_nulos()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);
        
        ReservaServicio::factory()->create([
            'reserva_id' => $reserva->id,
            'servicio_id' => $this->servicio->id,
            'emprendedor_id' => $this->emprendedor->id,
            'precio' => null,
            'cantidad' => 2
        ]);
        
        ReservaServicio::factory()->create([
            'reserva_id' => $reserva->id,
            'servicio_id' => $this->servicio->id,
            'emprendedor_id' => $this->emprendedor->id,
            'precio' => 50.00,
            'cantidad' => null
        ]);

        // Act
        $precioTotal = $reserva->precio_total;

        // Assert
        $this->assertEquals(50.00, $precioTotal); // (0 * 2) + (50 * 1)
    }

    #[Test]
    public function puede_actualizar_campos_individuales()
    {
        // Arrange
        $reserva = Reserva::factory()->create([
            'usuario_id' => $this->usuario->id,
            'estado' => Reserva::ESTADO_PENDIENTE,
            'notas' => 'Notas originales'
        ]);

        // Act
        $reserva->update([
            'estado' => Reserva::ESTADO_CONFIRMADA,
            'notas' => 'Notas actualizadas'
        ]);

        // Assert
        $this->assertEquals(Reserva::ESTADO_CONFIRMADA, $reserva->fresh()->estado);
        $this->assertEquals('Notas actualizadas', $reserva->fresh()->notas);
    }

    #[Test]
    public function puede_eliminar_reserva()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);
        $id = $reserva->id;

        // Act
        $result = $reserva->delete();

        // Assert
        $this->assertTrue($result);
        $this->assertDatabaseMissing('reservas', ['id' => $id]);
    }

    #[Test]
    public function maneja_valores_nulos_correctamente()
    {
        // Arrange & Act
        $reserva = Reserva::factory()->create([
            'usuario_id' => $this->usuario->id,
            'codigo_reserva' => null,
            'notas' => null
        ]);

        // Assert
        $this->assertNull($reserva->codigo_reserva);
        $this->assertNull($reserva->notas);
        $this->assertNotNull($reserva->usuario_id);
        $this->assertNotNull($reserva->estado);
    }

    #[Test]
    public function created_at_y_updated_at_se_establecen_automaticamente()
    {
        // Arrange & Act
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);

        // Assert
        $this->assertNotNull($reserva->created_at);
        $this->assertNotNull($reserva->updated_at);
        $this->assertInstanceOf(Carbon::class, $reserva->created_at);
        $this->assertInstanceOf(Carbon::class, $reserva->updated_at);
    }

    #[Test]
    public function puede_convertir_a_array()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);

        // Act
        $array = $reserva->toArray();

        // Assert
        $this->assertIsArray($array);
        $this->assertArrayHasKey('id', $array);
        $this->assertArrayHasKey('usuario_id', $array);
        $this->assertArrayHasKey('codigo_reserva', $array);
        $this->assertArrayHasKey('estado', $array);
        $this->assertArrayHasKey('notas', $array);
        $this->assertArrayHasKey('created_at', $array);
        $this->assertArrayHasKey('updated_at', $array);
    }

    #[Test]
    public function puede_convertir_a_json()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);

        // Act
        $json = $reserva->toJson();
        $data = json_decode($json, true);

        // Assert
        $this->assertIsString($json);
        $this->assertIsArray($data);
        $this->assertArrayHasKey('id', $data);
        $this->assertArrayHasKey('usuario_id', $data);
        $this->assertArrayHasKey('estado', $data);
    }

    #[Test]
    public function tabla_correcta_es_utilizada()
    {
        // Arrange
        $reserva = new Reserva();

        // Act
        $tabla = $reserva->getTable();

        // Assert
        $this->assertEquals('reservas', $tabla);
    }

    #[Test]
    public function primary_key_es_id_por_defecto()
    {
        // Arrange
        $reserva = new Reserva();

        // Act
        $primaryKey = $reserva->getKeyName();

        // Assert
        $this->assertEquals('id', $primaryKey);
    }

    #[Test]
    public function timestamps_estan_habilitados()
    {
        // Arrange
        $reserva = new Reserva();

        // Act
        $timestamps = $reserva->usesTimestamps();

        // Assert
        $this->assertTrue($timestamps);
    }

    #[Test]
    public function puede_cargar_relaciones_eager()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);
        ReservaServicio::factory()->count(2)->create([
            'reserva_id' => $reserva->id,
            'servicio_id' => $this->servicio->id,
            'emprendedor_id' => $this->emprendedor->id
        ]);

        // Act
        $reservaConRelaciones = Reserva::with(['usuario', 'servicios'])->find($reserva->id);

        // Assert
        $this->assertTrue($reservaConRelaciones->relationLoaded('usuario'));
        $this->assertTrue($reservaConRelaciones->relationLoaded('servicios'));
        $this->assertInstanceOf(User::class, $reservaConRelaciones->usuario);
        $this->assertCount(2, $reservaConRelaciones->servicios);
    }

    #[Test]
    public function puede_filtrar_por_estado()
    {
        // Arrange
        $reservaPendiente = Reserva::factory()->pendiente()->create(['usuario_id' => $this->usuario->id]);
        $reservaConfirmada = Reserva::factory()->confirmada()->create(['usuario_id' => $this->usuario->id]);
        $reservaCancelada = Reserva::factory()->cancelada()->create(['usuario_id' => $this->usuario->id]);

        // Act
        $reservasPendientes = Reserva::where('estado', Reserva::ESTADO_PENDIENTE)->get();
        $reservasConfirmadas = Reserva::where('estado', Reserva::ESTADO_CONFIRMADA)->get();

        // Assert
        $this->assertTrue($reservasPendientes->contains('id', $reservaPendiente->id));
        $this->assertFalse($reservasPendientes->contains('id', $reservaConfirmada->id));
        
        $this->assertTrue($reservasConfirmadas->contains('id', $reservaConfirmada->id));
        $this->assertFalse($reservasConfirmadas->contains('id', $reservaPendiente->id));
    }

    #[Test]
    public function puede_filtrar_por_usuario()
    {
        // Arrange
        $otroUsuario = User::factory()->create();
        
        $reservasUsuario1 = Reserva::factory()->count(3)->create(['usuario_id' => $this->usuario->id]);
        $reservasUsuario2 = Reserva::factory()->count(2)->create(['usuario_id' => $otroUsuario->id]);

        // Act
        $reservasDelUsuario1 = Reserva::where('usuario_id', $this->usuario->id)->get();
        $reservasDelUsuario2 = Reserva::where('usuario_id', $otroUsuario->id)->get();

        // Assert
        $this->assertCount(3, $reservasDelUsuario1);
        $this->assertCount(2, $reservasDelUsuario2);
        
        foreach ($reservasDelUsuario1 as $reserva) {
            $this->assertEquals($this->usuario->id, $reserva->usuario_id);
        }
    }

    #[Test]
    public function puede_buscar_por_codigo_reserva()
    {
        // Arrange
        $codigoEspecifico = 'TEST123' . date('ymd');
        $reserva = Reserva::factory()->create([
            'usuario_id' => $this->usuario->id,
            'codigo_reserva' => $codigoEspecifico
        ]);

        // Act
        $reservaEncontrada = Reserva::where('codigo_reserva', $codigoEspecifico)->first();

        // Assert
        $this->assertNotNull($reservaEncontrada);
        $this->assertEquals($reserva->id, $reservaEncontrada->id);
        $this->assertEquals($codigoEspecifico, $reservaEncontrada->codigo_reserva);
    }

    #[Test]
    public function atributos_calculados_manejan_reserva_sin_servicios()
    {
        // Arrange
        $reserva = Reserva::factory()->create(['usuario_id' => $this->usuario->id]);

        // Act & Assert
        $this->assertEquals(0, $reserva->total_servicios);
        $this->assertNull($reserva->fecha_inicio);
        $this->assertNull($reserva->fecha_fin);
        $this->assertEquals(0.0, $reserva->precio_total);
    }

    #[Test]
    public function puede_ordenar_por_fecha_creacion()
    {
        // Arrange
        $reserva1 = Reserva::factory()->create([
            'usuario_id' => $this->usuario->id,
            'created_at' => now()->subDays(2)
        ]);
        
        $reserva2 = Reserva::factory()->create([
            'usuario_id' => $this->usuario->id,
            'created_at' => now()->subDays(1)
        ]);
        
        $reserva3 = Reserva::factory()->create([
            'usuario_id' => $this->usuario->id,
            'created_at' => now()
        ]);

        // Act
        $reservasOrdenadas = Reserva::orderBy('created_at', 'desc')->get();

        // Assert
        $this->assertEquals($reserva3->id, $reservasOrdenadas[0]->id); // Más reciente
        $this->assertEquals($reserva2->id, $reservasOrdenadas[1]->id);
        $this->assertEquals($reserva1->id, $reservasOrdenadas[2]->id); // Más antigua
    }
}