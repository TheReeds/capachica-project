<?php
namespace Tests\Unit\Services;

use App\Models\{
    Emprendedor,
    Asociacion,
    Slider,
    Servicio,
    User
};
use App\Repository\SliderRepository;
use App\Services\EmprendedoresService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * @covers \App\Services\EmprendedoresService
 */
class EmprendedoresServiceTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private EmprendedoresService $service;
    private SliderRepository    $sliderMock;

    protected function setUp(): void
    {
        parent::setUp();

        // --- Mock del repositorio de sliders (evita golpear la bd y simplifica verificación) ---
        $this->sliderMock = $this->createMock(SliderRepository::class);

        // Por defecto, que no lance excepciones ni devuelva nada especial
        $this->sliderMock->method('createMultiple')->willReturn(collect());
        $this->sliderMock->method('updateEntitySliders')->willReturn(collect());
        $this->sliderMock->method('delete')->willReturn(true);

        // Vinculamos el mock en el contenedor
        $this->app->instance(SliderRepository::class, $this->sliderMock);

        // Instanciamos el servicio (le llegará el mock desde el contenedor)
        $this->service = app(EmprendedoresService::class);
    }

    /* -----------------------------------------------------------------
     |  Métodos de obtención
     | ----------------------------------------------------------------- */

    #[Test]
    public function puede_obtener_todos_los_emprendedores_paginados()
    {
        Emprendedor::factory()->count(7)->create();

        $result = $this->service->getAll();

        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals(7, $result->total());
    }

    #[Test]
    public function puede_filtrar_emprendedores_del_usuario_actual()
    {
        // Creamos usuario y emprendimientos
        $user    = User::factory()->create();
        $own     = Emprendedor::factory()->count(2)->create();
        $others  = Emprendedor::factory()->count(3)->create();

        // Relacionamos usuario-administrador a sus emprendimientos
        $own->each(fn ($e) => $e->administradores()->attach($user->id));

        // Autenticamos
        Auth::login($user);

        $result = $this->service->getAll(perPage: 15, soloDelUsuarioActual: true);

        $this->assertEquals(2, $result->total());
        $this->assertTrue($result->contains('id', $own->first()->id));
        $this->assertFalse($result->contains('id', $others->first()->id));
    }

    #[Test]
    public function puede_obtener_un_emprendedor_por_id()
    {
        $emprendedor = Emprendedor::factory()->create();

        $result = $this->service->getById($emprendedor->id);

        $this->assertInstanceOf(Emprendedor::class, $result);
        $this->assertEquals($emprendedor->id, $result->id);
    }

    #[Test]
    public function retorna_null_cuando_emprendedor_no_existe()
    {
        $this->assertNull($this->service->getById(9999));
    }

    /* -----------------------------------------------------------------
     |  Crear – Update – Delete
     | ----------------------------------------------------------------- */

    #[Test]
    public function puede_crear_un_emprendedor_con_sliders()
    {
        // Datos de prueba usando el factory como base
        $factoryData = Emprendedor::factory()->make()->toArray();
        $data = array_merge($factoryData, [
            'sliders_principales' => [
                ['url' => 'https://ejemplo.com/1.jpg'],
                ['url' => 'https://ejemplo.com/2.jpg'],
            ],
            'sliders_secundarios' => [
                ['url' => 'https://ejemplo.com/3.jpg'],
            ],
        ]);

        // Esperamos que SliderRepository sea llamado 2 veces
        $this->sliderMock->expects($this->exactly(2))
            ->method('createMultiple');

        $result = $this->service->create($data);

        $this->assertInstanceOf(Emprendedor::class, $result);
        $this->assertDatabaseHas('emprendedores', [
            'id'   => $result->id,
            'nombre' => $data['nombre'],
        ]);
    }

    #[Test]
    public function puede_actualizar_un_emprendedor_existente()
    {
        $emprendedor = Emprendedor::factory()->create(['nombre' => 'Original']);
        $data = ['nombre' => 'Actualizado'];

        $result = $this->service->update($emprendedor->id, $data);

        $this->assertInstanceOf(Emprendedor::class, $result);
        $this->assertEquals('Actualizado', $result->nombre);
        $this->assertDatabaseHas('emprendedores', [
            'id' => $emprendedor->id,
            'nombre' => 'Actualizado',
        ]);
    }

    #[Test]
    public function retorna_null_al_actualizar_emprendedor_inexistente()
    {
        $this->assertNull($this->service->update(999, ['nombre' => 'x']));
    }

    #[Test]
    public function puede_eliminar_emprendedor_existente()
    {
        // --- Creamos emprendedor sin slider asociado (el mock se encarga) ---
        $emprendedor = Emprendedor::factory()->create();

        // No esperamos que se llame al método delete porque no hay sliders
        $this->sliderMock->expects($this->never())
            ->method('delete');

        $result = $this->service->delete($emprendedor->id);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('emprendedores', ['id' => $emprendedor->id]);
    }

    #[Test]
    public function retorna_false_al_eliminar_emprendedor_inexistente()
    {
        $this->assertFalse($this->service->delete(9999));
    }

    /* -----------------------------------------------------------------
     |  Búsquedas simples
     | ----------------------------------------------------------------- */

    #[Test]
    public function puede_buscar_por_categoria()
    {
        Emprendedor::factory()->create(['categoria' => 'Arte']);
        Emprendedor::factory()->create(['categoria' => 'Tecnología']);

        $result = $this->service->findByCategory('Tecnología');

        $this->assertInstanceOf(Collection::class, $result);
        $this->assertCount(1, $result);
    }

    #[Test]
    public function puede_buscar_por_asociacion()
    {
        $asociacion = Asociacion::factory()->create();
        Emprendedor::factory()->count(2)->for($asociacion)->create();
        Emprendedor::factory()->create(); // otro

        $result = $this->service->findByAsociacion($asociacion->id);

        $this->assertInstanceOf(Collection::class, $result);
        $this->assertCount(2, $result);
    }

    #[Test]
    public function puede_buscar_por_texto()
    {
        Emprendedor::query()->delete(); // Limpiar tabla antes del test

        // Primer emprendedor: nombre contiene 'pan', descripción NO
        $emprendedor1 = Emprendedor::factory()->create([
            'nombre' => 'panaderia lima',
            'descripcion' => 'venta de pasteles'
        ]);
        // Segundo emprendedor: nombre NO contiene 'pan', descripción SÍ
        $emprendedor2 = Emprendedor::factory()->create([
            'nombre' => 'restaurante',
            'descripcion' => 'los mejores panes de la ciudad'
        ]);
        // Tercero: no debe coincidir
        Emprendedor::factory()->create([
            'nombre' => 'cafeteria',
            'descripcion' => 'cafe y postres'
        ]);

        $result = $this->service->search('pan');

        $this->assertInstanceOf(\Illuminate\Support\Collection::class, $result);
        $this->assertCount(2, $result); // nombre y descripción
        $this->assertTrue($result->contains('id', $emprendedor1->id));
        $this->assertTrue($result->contains('id', $emprendedor2->id));
    }

    /* -----------------------------------------------------------------
     |  Relaciones complejas
     | ----------------------------------------------------------------- */

    #[Test]
    public function puede_obtener_emprendedor_con_relaciones()
    {
        // Emprendedor con asociación (sin sliders que requieren factory)
        $emprendedor = Emprendedor::factory()
            ->has(Asociacion::factory(), 'asociacion')
            ->create();

        $result = $this->service->getWithRelations($emprendedor->id);

        $this->assertInstanceOf(Emprendedor::class, $result);
        $this->assertTrue($result->relationLoaded('asociacion'));
    }

    #[Test]
    public function puede_obtener_emprendimientos_por_usuario()
    {
        $user = User::factory()->create();
        $owned = Emprendedor::factory()->count(3)->create();
        $owned->each(fn($e) => $e->administradores()->attach($user->id));

        $result = $this->service->getByUserId($user->id);

        $this->assertInstanceOf(Collection::class, $result);
        $this->assertCount(3, $result);
    }

    /* -----------------------------------------------------------------
     |  Comprobaciones de rol administrador
     | ----------------------------------------------------------------- */

    #[Test]
    public function verifica_si_usuario_es_administrador()
    {
        [$user, $otro] = User::factory()->count(2)->create();
        $emprendedor = Emprendedor::factory()->create();
        $emprendedor->administradores()->attach($user->id);

        $this->assertTrue($this->service->esAdministrador($emprendedor->id, $user->id));
        $this->assertFalse($this->service->esAdministrador($emprendedor->id, $otro->id));
    }

    #[Test]
    public function verifica_si_usuario_es_administrador_principal()
    {
        $user = User::factory()->create();
        $emprendedor = Emprendedor::factory()->create();
        // Indicamos que es_principal = true en el pivot
        $emprendedor->administradores()->attach($user->id, ['es_principal' => true]);

        $this->assertTrue($this->service->esAdministradorPrincipal($emprendedor->id, $user->id));
    }
}
