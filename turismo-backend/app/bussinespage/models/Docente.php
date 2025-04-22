<?php

namespace App\bussinespage\models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Docente extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'apellido', 'email', 'especialidad'];
}
