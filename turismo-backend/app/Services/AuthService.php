<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class AuthService
{
    /**
     * Register a new user
     *
     * @param array $data
     * @param UploadedFile|null $profilePhoto
     * @return User
     */
    public function register(array $data, ?UploadedFile $profilePhoto = null): User
    {
        $userData = [
            'name' => $data['name'],
            'first_name' => $data['first_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
        ];
        
        // Process profile photo if provided
        if ($profilePhoto) {
            $userData['foto_perfil'] = $profilePhoto->store('fotos_perfil', 'public');
        }

        $user = User::create($userData);
        
        // Assign default user role
        $user->assignRole('user');
        
        // Dispatch registered event to trigger verification email
        event(new Registered($user));
        
        return $user;
    }
    
    /**
     * Handle user login
     *
     * @param string $email
     * @param string $password
     * @return array|null
     */
    public function login(string $email, string $password): ?array
    {
        if (!auth()->attempt(['email' => $email, 'password' => $password])) {
            return null;
        }
        
        $user = User::where('email', $email)->firstOrFail();
        
        // Check if the user is active
        if (!$user->active) {
            return ['error' => 'inactive_user'];
        }
        
        // Delete previous tokens
        $user->tokens()->delete();
        
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return [
            'user' => $user,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'administra_emprendimientos' => $user->administraEmprendimientos(),
            'access_token' => $token,
            'token_type' => 'Bearer',
            'email_verified' => $user->hasVerifiedEmail(),
        ];
    }
    
    /**
     * Handle Google OAuth login
     *
     * @param string $provider
     * @return array
     */
    public function handleGoogleCallback(): array
    {
        try {
                // Configurar Socialite para ignorar verificación SSL solo en desarrollo
            if (app()->environment('local')) {
                $client = new \GuzzleHttp\Client(['verify' => false]);
                \Laravel\Socialite\Facades\Socialite::driver('google')->setHttpClient($client);
            }
            
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            // Buscar usuario por google_id o por email
            $user = User::where('google_id', $googleUser->id)
                        ->orWhere('email', $googleUser->email)
                        ->first();
            
            // Si el usuario no existe, crear uno nuevo
            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => Hash::make(Str::random(16)),
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'email_verified_at' => now(), // Marcar como verificado ya que proviene de Google
                ]);
                
                // Asignar rol de usuario
                $user->assignRole('user');
            } 
            // Si el usuario existe pero no tiene google_id, actualizar
            else if (!$user->google_id) {
                $user->update([
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'email_verified_at' => now(), // Marcar como verificado
                ]);
            }
            
            // Eliminar tokens anteriores
            $user->tokens()->delete();
            
            // Crear nuevo token
            $token = $user->createToken('auth_token')->plainTextToken;
            
            return [
                'user' => $user,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'administra_emprendimientos' => $user->administraEmprendimientos(),
                'access_token' => $token,
                'token_type' => 'Bearer',
                'email_verified' => true,
            ];
        } catch (\Exception $e) {
            return [
                'error' => 'google_auth_failed',
                'message' => $e->getMessage(),
            ];
        }
    }
    
    /**
     * Update user profile
     *
     * @param User $user
     * @param array $data
     * @param UploadedFile|null $profilePhoto
     * @return User
     */
    public function updateProfile(User $user, array $data, ?UploadedFile $profilePhoto = null): User
    {
        $userData = array_filter($data, function ($key) {
            return in_array($key, ['name', 'first_name', 'last_name', 'email', 'phone']);
        }, ARRAY_FILTER_USE_KEY);
        
        // Update password if provided
        if (!empty($data['password'])) {
            $userData['password'] = Hash::make($data['password']);
        }
        
        // Process profile photo if provided
        if ($profilePhoto && $profilePhoto->isValid()) {
            // Delete previous photo if exists
            if ($user->foto_perfil && !filter_var($user->foto_perfil, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete($user->foto_perfil);
            }
            
            $userData['foto_perfil'] = $profilePhoto->store('fotos_perfil', 'public');
        }
        
        // Si el email cambia, marcar como no verificado
        if (isset($userData['email']) && $userData['email'] !== $user->email) {
            $userData['email_verified_at'] = null;
        }
        
        $user->update($userData);
        
        // Si el email cambió, enviar verificación
        if (isset($userData['email']) && $userData['email'] !== $user->email) {
            $user->sendEmailVerificationNotification();
        }
        
        return $user;
    }
    
    /**
     * Send password reset link
     *
     * @param string $email
     * @return string
     */
    public function sendPasswordResetLink(string $email): string
    {
        $status = Password::sendResetLink(['email' => $email]);
        
        return $status;
    }
    
    /**
     * Reset password
     *
     * @param array $data
     * @return string
     */
    public function resetPassword(array $data): string
    {
        $status = Password::reset(
            $data,
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));
                
                $user->save();
                
                event(new PasswordReset($user));
            }
        );
        
        return $status;
    }
    
    /**
     * Verify email
     *
     * @param int $id
     * @param string $hash
     * @return bool
     */
    public function verifyEmail(int $id, string $hash): bool
    {
        $user = User::findOrFail($id);
        
        if (!hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return false;
        }
        
        if ($user->hasVerifiedEmail()) {
            return true;
        }
        
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }
        
        return true;
    }
    
    /**
     * Resend verification email
     *
     * @param User $user
     * @return void
     */
    public function resendVerificationEmail(User $user): void
    {
        if ($user->hasVerifiedEmail()) {
            throw new \Exception('Email already verified');
        }
        
        $user->sendEmailVerificationNotification();
    }
}