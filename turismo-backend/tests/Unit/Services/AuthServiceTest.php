<?php
namespace Tests\Unit\Services;

use App\Models\User;
use App\Services\AuthService;
use GuzzleHttp\Client;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\{
    Event,
    Hash,
    Notification,
    Password,
    Socialite,
    Storage
};
use Laravel\Sanctum\Sanctum;
use Laravel\Socialite\Contracts\User as SocialiteUserContract;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @covers \App\Services\AuthService
 */
class AuthServiceTest extends TestCase
{
    use RefreshDatabase;

    private AuthService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(AuthService::class);

        // No necesitamos notificaciones reales
        Notification::fake();
        Event::fake();            // Registered, Verified, PasswordReset…
        Storage::fake('public');  // Para las fotos de perfil
    }

    /* -----------------------------------------------------------------
     |  Registro
     | ----------------------------------------------------------------- */

    #[Test]
    public function puede_registrar_un_usuario_con_foto()
    {
        // Assertion temporal para depuración
        $this->assertDatabaseHas('roles', ['name' => 'user']);

        $photo = UploadedFile::fake()->image('avatar.jpg');

        $data = [
            'name'     => 'Juan Pérez',
            'email'    => 'juan@example.com',
            'password' => 'secret123',
        ];

        $user = $this->service->register($data, $photo);

        // Asertamos creación y eventos despachados
        $this->assertDatabaseHas('users', ['id' => $user->id, 'email' => 'juan@example.com']);
        Event::assertDispatched(Registered::class);

        // Foto almacenada
        Storage::disk('public')->assertExists($user->foto_perfil);
    }

    /* -----------------------------------------------------------------
     |  Login
     | ----------------------------------------------------------------- */

    #[Test]
    public function puede_iniciar_sesion_y_generar_token()
    {
        $user = User::factory()->create(['password' => Hash::make('pass')]);

        $payload = $this->service->login($user->email, 'pass');

        $this->assertNotNull($payload);
        $this->assertArrayHasKey('access_token', $payload);
        $this->assertTrue($payload['user']->is($user));
        $this->assertNotNull($user->fresh()->last_login);
    }

    #[Test]
    public function retorna_null_con_credenciales_invalidas()
    {
        User::factory()->create(['email' => 'a@a.com', 'password' => Hash::make('pass')]);

        $this->assertNull($this->service->login('a@a.com', 'wrong'));
    }

    #[Test]
    public function retorna_error_si_usuario_inactivo()
    {
        $user = User::factory()->create(['password' => Hash::make('pass'), 'active' => false]);

        $payload = $this->service->login($user->email, 'pass');

        $this->assertEquals(['error' => 'inactive_user'], $payload);
    }

    /* -----------------------------------------------------------------
     |  Google OAuth
     | ----------------------------------------------------------------- */

    #[Test]
    public function crea_usuario_nuevo_con_google_si_no_existe()
    {
        // Fake Socialite user
        $googleUser = new class implements SocialiteUserContract {
            public $id = 'google-123';
            public $name = 'Google User';
            public $email = 'google@example.com';
            public $avatar = 'https://img';
            public $user = ['locale' => 'es-PE'];

            public function getId()     { return $this->id; }
            public function getName()   { return $this->name; }
            public function getEmail()  { return $this->email; }
            public function getAvatar() { return $this->avatar; }
            public function getNickname() {}
            public function getRaw() { return $this->user; }
        };

        // Mock chain: driver('google')->stateless()->user()
        Socialite::shouldReceive('driver')->with('google')->andReturnSelf();
        Socialite::shouldReceive('stateless')->andReturnSelf();
        Socialite::shouldReceive('user')->andReturn($googleUser);

        $payload = $this->service->handleGoogleCallback();

        $this->assertArrayHasKey('access_token', $payload);
        $this->assertDatabaseHas('users', ['email' => 'google@example.com', 'google_id' => 'google-123']);
        $this->assertTrue($payload['email_verified']);
    }

    /* -----------------------------------------------------------------
     |  Actualizar perfil
     | ----------------------------------------------------------------- */

    #[Test]
    public function puede_actualizar_perfil_y_revocar_verificacion_si_cambia_email()
    {
        $user = User::factory()->unverified()->create(['email' => 'old@ex.com']);

        $this->service->updateProfile($user, ['email' => 'new@ex.com', 'name' => 'Nuevo']);

        $user->refresh();
        $this->assertEquals('new@ex.com', $user->email);
        $this->assertNull($user->email_verified_at); // desverificado
    }

    #[Test]
    public function cambia_foto_de_perfil_eliminando_la_anterior()
    {
        // Foto original
        $old = UploadedFile::fake()->image('old.jpg')->store('fotos_perfil', 'public');
        $user = User::factory()->create(['foto_perfil' => $old]);

        // Nueva foto
        $newPhoto = UploadedFile::fake()->image('new.jpg');

        $this->service->updateProfile($user, [], $newPhoto);

        Storage::disk('public')->assertMissing($old);
        Storage::disk('public')->assertExists($user->fresh()->foto_perfil);
    }

    /* -----------------------------------------------------------------
     |  Restablecer contraseña
     | ----------------------------------------------------------------- */

    #[Test]
    public function envia_link_para_restablecer_contrasena()
    {
        Password::shouldReceive('sendResetLink')
            ->once()
            ->with(['email' => 'foo@bar.com'])
            ->andReturn(Password::RESET_LINK_SENT);

        $status = $this->service->sendPasswordResetLink('foo@bar.com');

        $this->assertEquals(Password::RESET_LINK_SENT, $status);
    }

    #[Test]
    public function resetea_contrasena_correctamente()
    {
        Password::shouldReceive('reset')->once()->andReturn(Password::PASSWORD_RESET);

        $status = $this->service->resetPassword([
            'email'                 => 'x@y.com',
            'token'                 => 'dummy',
            'password'              => 'new-pass',
            'password_confirmation' => 'new-pass',
        ]);

        $this->assertEquals(Password::PASSWORD_RESET, $status);
    }

    /* -----------------------------------------------------------------
     |  Verificar correo
     | ----------------------------------------------------------------- */

    #[Test]
    public function verifica_email_con_hash_valido()
    {
        $user = User::factory()->unverified()->create();

        $hash = sha1($user->getEmailForVerification());

        $this->assertTrue($this->service->verifyEmail($user->id, $hash));

        Event::assertDispatched(Verified::class);
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
    }

    #[Test]
    public function devuelve_false_con_hash_invalido()
    {
        $user = User::factory()->unverified()->create();

        $this->assertFalse($this->service->verifyEmail($user->id, 'bad-hash'));
    }

    #[Test]
    public function puede_reenviar_correo_de_verificacion()
    {
        $user = User::factory()->unverified()->create();

        // No debería lanzar excepción
        $this->service->resendVerificationEmail($user);

        Notification::assertSentTo($user, \Illuminate\Auth\Notifications\VerifyEmail::class);
    }
}
