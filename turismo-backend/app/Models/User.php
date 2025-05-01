<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use App\reservas\Emprendedores\Models\Emprendedor;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'active',
        'foto_perfil',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'active' => 'boolean',
    ];
    protected $appends = [
        'foto_perfil_url',
    ];
    /**
     * Obtener los emprendimientos administrados por el usuario
     */
    public function emprendimientos()
    {
        return $this->belongsToMany(Emprendedor::class, 'user_emprendedor')
                    ->withPivot('es_principal', 'rol')
                    ->withTimestamps();
    }
    
    /**
     * Verificar si el usuario administra algún emprendimiento
     */
    public function administraEmprendimientos()
    {
        return $this->emprendimientos()->exists();
    }
    
    /**
     * Obtener la URL completa de la foto de perfil
     */
    public function getFotoPerfilUrlAttribute()
    {
        if (!$this->foto_perfil) {
            return null;
        }
        
        if (filter_var($this->foto_perfil, FILTER_VALIDATE_URL)) {
            return $this->foto_perfil;
        }
        
        return url(Storage::url($this->foto_perfil));
    }
}