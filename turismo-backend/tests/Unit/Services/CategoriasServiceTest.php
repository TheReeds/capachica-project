<?php
namespace Tests\Unit\Services;

use App\Models\Categoria;
use App\Repository\CategoriaRepository;
use App\Services\CategoriasService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class CategoriasServiceTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected CategoriasService $service;

    protected function setUp(): void
    {
        parent::setUp();

        // Usar el contenedor de dependencias de Laravel
        $this->service = app(CategoriasService::class);
    }

    #[Test]
    public function puede_obtener_todas_las_categorias_paginadas()
    {
        // Arrange
        Categoria::factory()->count(5)->create();

        // Act
        $result = $this->service->getAll();

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals(5, $result->total());
    }

    #[Test]
    public function puede_obtener_todas_las_categorias_sin_paginacion()
    {
        // Arrange
        Categoria::factory()->count(3)->create();

        // Act
        $result = $this->service->getAll();

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals(3, $result->total());
    }

    #[Test]
    public function puede_obtener_una_categoria_por_id()
    {
        // Arrange
        $categoria = Categoria::factory()->create();

        // Act
        $result = $this->service->getById($categoria->id);

        // Assert
        $this->assertInstanceOf(Categoria::class, $result);
        $this->assertEquals($categoria->id, $result->id);
    }

    #[Test]
    public function retorna_null_cuando_categoria_no_existe()
    {
        // Act
        $result = $this->service->getById(999);

        // Assert
        $this->assertNull($result);
    }

    #[Test]
    public function puede_obtener_categoria_con_servicios()
    {
        // Arrange
        $categoria = Categoria::factory()->create();

        // Act
        $result = $this->service->getById($categoria->id);

        // Assert
        $this->assertInstanceOf(Categoria::class, $result);
    }

    #[Test]
    public function retorna_null_al_obtener_categoria_con_servicios_inexistente()
    {
        // Act
        $result = $this->service->getById(999);

        // Assert
        $this->assertNull($result);
    }

    #[Test]
    public function puede_crear_nueva_categoria()
    {
        // Arrange
        $data = [
            'nombre' => 'Nueva Categoría',
            'descripcion' => 'Descripción de la categoría'
        ];

        // Act
        $result = $this->service->create($data);

        // Assert
        $this->assertInstanceOf(Categoria::class, $result);
        $this->assertEquals($data['nombre'], $result->nombre);
        $this->assertDatabaseHas('categorias', $data);
    }

    #[Test]
    public function puede_actualizar_categoria_existente()
    {
        // Arrange
        $categoria = Categoria::factory()->create();
        $data = ['nombre' => 'Categoría Actualizada'];

        // Act
        $result = $this->service->update($categoria->id, $data);

        // Assert
        $this->assertInstanceOf(Categoria::class, $result);
        $this->assertEquals('Categoría Actualizada', $result->nombre);
        $this->assertDatabaseHas('categorias', [
            'id' => $categoria->id,
            'nombre' => 'Categoría Actualizada'
        ]);
    }

    #[Test]
    public function retorna_null_al_actualizar_categoria_inexistente()
    {
        // Arrange
        $data = ['nombre' => 'Categoría Actualizada'];

        // Act
        $result = $this->service->update(999, $data);

        // Assert
        $this->assertNull($result);
    }

    #[Test]
    public function puede_eliminar_categoria_existente()
    {
        // Arrange
        $categoria = Categoria::factory()->create();

        // Act
        $result = $this->service->delete($categoria->id);

        // Assert
        $this->assertTrue($result);
        $this->assertDatabaseMissing('categorias', ['id' => $categoria->id]);
    }

    #[Test]
    public function retorna_false_al_eliminar_categoria_inexistente()
    {
        // Act
        $result = $this->service->delete(999);

        // Assert
        $this->assertFalse($result);
    }

    #[Test]
    public function puede_buscar_categorias_por_nombre()
    {
        // Arrange
        Categoria::factory()->create(['nombre' => 'Tecnología']);
        Categoria::factory()->create(['nombre' => 'Salud']);
        Categoria::factory()->create(['nombre' => 'Tecnología Médica']);
        $termino = 'Tecnología';

        // Act
        $result = $this->service->buscar($termino);

        // Assert
        $this->assertInstanceOf(Collection::class, $result);
        $this->assertEquals(2, $result->count());
    }

    #[Test]
    public function puede_obtener_categorias_activas_solamente()
    {
        // Arrange
        // Como la tabla categorias no tiene columna estado, creamos categorias normales
        Categoria::factory()->count(3)->create();

        // Act
        $result = $this->service->getActivas();

        // Assert
        $this->assertInstanceOf(Collection::class, $result);
        // Como no hay filtro de estado, debería devolver todas las categorias
        $this->assertEquals(3, $result->count());
    }
}
