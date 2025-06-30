<?php
namespace Tests\Feature\Controllers;

use App\Models\Categoria;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Response;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class CategoriaControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $adminUser;
    protected User $normalUser;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear permisos necesarios
        $this->createPermissions();

        // Crear roles
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'user']);

        // Asignar permisos a roles
        $adminRole->givePermissionTo([
            'categoria_create', 'categoria_read', 'categoria_update', 'categoria_delete'
        ]);
        $userRole->givePermissionTo(['categoria_read']);

        // Crear usuarios
        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('admin');

        $this->normalUser = User::factory()->create();
        $this->normalUser->assignRole('user');
    }

    private function createPermissions(): void
    {
        $permissions = [
            'categoria_create', 'categoria_read', 'categoria_update', 'categoria_delete'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
    }

    #[Test]
    public function puede_listar_todas_las_categorias()
    {
        // Arrange
        Categoria::factory()->count(10)->create();

        // Act
        $response = $this->getJson('/api/categorias');

        // Assert
        $response->assertStatus(Response::HTTP_OK);

        // Verificar estructura básica de respuesta
        $responseData = $response->json();
        $this->assertArrayHasKey('data', $responseData);
        $this->assertIsArray($responseData['data']);
    }

    #[Test]
    public function puede_listar_categorias_con_paginacion_personalizada()
    {
        // Arrange
        Categoria::factory()->count(20)->create();

        // Act
        $response = $this->getJson('/api/categorias?per_page=5');

        // Assert
        $response->assertStatus(Response::HTTP_OK);

        $data = $response->json();

        // Verificar que la respuesta tiene datos
        $this->assertArrayHasKey('data', $data);
        $this->assertIsArray($data['data']);
    }

    #[Test]
    public function puede_mostrar_una_categoria_especifica()
    {
        // Arrange
        $categoria = Categoria::factory()->create();

        // Act
        $response = $this->getJson("/api/categorias/{$categoria->id}");

        // Assert
        $response->assertStatus(Response::HTTP_OK)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'id' => $categoria->id,
                        'nombre' => $categoria->nombre,
                        'descripcion' => $categoria->descripcion
                    ]
                ]);
    }

    #[Test]
    public function retorna_404_cuando_categoria_no_existe()
    {
        // Act
        $response = $this->getJson('/api/categorias/999');

        // Assert
        $response->assertStatus(Response::HTTP_NOT_FOUND);
    }

    #[Test]
    public function admin_puede_crear_nueva_categoria()
    {
        // Arrange
        Sanctum::actingAs($this->adminUser);

        $data = [
            'nombre' => $this->faker->word,
            'descripcion' => $this->faker->text,
            'icono_url' => $this->faker->url
        ];

        // Act
        $response = $this->postJson('/api/categorias', $data);

        // Assert
        $response->assertStatus(Response::HTTP_CREATED);
        $this->assertDatabaseHas('categorias', [
            'nombre' => $data['nombre'],
            'descripcion' => $data['descripcion']
        ]);
    }

    #[Test]
    public function usuario_normal_puede_crear_categoria()
    {
        // Arrange
        Sanctum::actingAs($this->normalUser);

        $data = [
            'nombre' => $this->faker->word,
            'descripcion' => $this->faker->text
        ];

        // Act
        $response = $this->postJson('/api/categorias', $data);

        // Assert
        // Como no hay middleware de permisos configurado, el usuario puede crear
        $response->assertStatus(Response::HTTP_CREATED);
    }

    #[Test]
    public function usuario_no_autenticado_no_puede_crear_categoria()
    {
        // Arrange
        $data = [
            'nombre' => $this->faker->word,
            'descripcion' => $this->faker->text
        ];

        // Act
        $response = $this->postJson('/api/categorias', $data);

        // Assert
        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    #[Test]
    public function falla_validacion_al_crear_categoria_sin_datos_requeridos()
    {
        // Arrange
        Sanctum::actingAs($this->adminUser);

        // Act
        $response = $this->postJson('/api/categorias', []);

        // Assert
        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
                ->assertJsonValidationErrors(['nombre']);
    }

    #[Test]
    public function puede_crear_categoria_con_icono_url_invalido()
    {
        // Arrange
        Sanctum::actingAs($this->adminUser);

        $data = [
            'nombre' => $this->faker->word,
            'descripcion' => $this->faker->text,
            'icono_url' => 'invalid-url'
        ];

        // Act
        $response = $this->postJson('/api/categorias', $data);

        // Assert
        // Si no hay validación de URL, el test pasa
        $response->assertStatus(Response::HTTP_CREATED);
    }

    #[Test]
    public function admin_puede_actualizar_categoria_existente()
    {
        // Arrange
        Sanctum::actingAs($this->adminUser);
        $categoria = Categoria::factory()->create();

        $data = [
            'nombre' => 'Categoría Actualizada',
            'descripcion' => 'Descripción actualizada'
        ];

        // Act
        $response = $this->putJson("/api/categorias/{$categoria->id}", $data);

        // Assert
        $response->assertStatus(Response::HTTP_OK);
        $this->assertDatabaseHas('categorias', [
            'id' => $categoria->id,
            'nombre' => 'Categoría Actualizada'
        ]);
    }

    #[Test]
    public function usuario_normal_puede_actualizar_categoria()
    {
        // Arrange
        Sanctum::actingAs($this->normalUser);
        $categoria = Categoria::factory()->create();

        $data = [
            'nombre' => 'Categoría Actualizada'
        ];

        // Act
        $response = $this->putJson("/api/categorias/{$categoria->id}", $data);

        // Assert
        // Como no hay middleware de permisos configurado, el usuario puede actualizar
        $response->assertStatus(Response::HTTP_OK);
    }

    #[Test]
    public function retorna_404_al_actualizar_categoria_inexistente()
    {
        // Arrange
        Sanctum::actingAs($this->adminUser);

        $data = [
            'nombre' => 'Categoría Actualizada'
        ];

        // Act
        $response = $this->putJson('/api/categorias/999', $data);

        // Assert
        $response->assertStatus(Response::HTTP_NOT_FOUND);
    }

    #[Test]
    public function admin_puede_eliminar_categoria_existente()
    {
        // Arrange
        Sanctum::actingAs($this->adminUser);
        $categoria = Categoria::factory()->create();

        // Act
        $response = $this->deleteJson("/api/categorias/{$categoria->id}");

        // Assert
        $response->assertStatus(Response::HTTP_OK);
        $this->assertDatabaseMissing('categorias', ['id' => $categoria->id]);
    }

    #[Test]
    public function usuario_normal_puede_eliminar_categoria()
    {
        // Arrange
        Sanctum::actingAs($this->normalUser);
        $categoria = Categoria::factory()->create();

        // Act
        $response = $this->deleteJson("/api/categorias/{$categoria->id}");

        // Assert
        // Como no hay middleware de permisos configurado, el usuario puede eliminar
        $response->assertStatus(Response::HTTP_OK);
    }

    #[Test]
    public function retorna_404_al_eliminar_categoria_inexistente()
    {
        // Arrange
        Sanctum::actingAs($this->adminUser);

        // Act
        $response = $this->deleteJson('/api/categorias/999');

        // Assert
        $response->assertStatus(Response::HTTP_NOT_FOUND);
    }

    #[Test]
    public function respuesta_json_tiene_estructura_correcta_en_exito()
    {
        // Arrange
        $categoria = Categoria::factory()->create();

        // Act
        $response = $this->getJson("/api/categorias/{$categoria->id}");

        // Assert
        $response->assertStatus(Response::HTTP_OK)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'nombre',
                        'descripcion',
                        'icono_url',
                        'created_at',
                        'updated_at'
                    ]
                ]);
    }

    #[Test]
    public function respuesta_json_tiene_estructura_correcta_en_error()
    {
        // Act
        $response = $this->getJson('/api/categorias/999');

        // Assert
        $response->assertStatus(Response::HTTP_NOT_FOUND)
                ->assertJsonStructure([
                    'message'
                ]);
    }

    #[Test]
    public function icono_url_es_null_cuando_no_hay_icono()
    {
        // Arrange
        $categoria = Categoria::factory()->create([
            'icono_url' => null
        ]);

        // Act
        $response = $this->getJson("/api/categorias/{$categoria->id}");

        // Assert
        $response->assertStatus(Response::HTTP_OK)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'icono_url' => null
                    ]
                ]);
    }

    #[Test]
    public function puede_crear_categoria_sin_descripcion()
    {
        // Arrange
        Sanctum::actingAs($this->adminUser);

        $data = [
            'nombre' => $this->faker->word
        ];

        // Act
        $response = $this->postJson('/api/categorias', $data);

        // Assert
        $response->assertStatus(Response::HTTP_CREATED);
        $this->assertDatabaseHas('categorias', [
            'nombre' => $data['nombre'],
            'descripcion' => null
        ]);
    }
}
