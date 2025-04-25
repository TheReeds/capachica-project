<?php

namespace App\reservas\Emprendedores\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

use Illuminate\Foundation\Http\FormRequest;

class EmprendedorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'nombre' => 'required|string|max:255',
            'tipo_servicio' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'ubicacion' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'pagina_web' => 'nullable|string|max:255',
            'horario_atencion' => 'nullable|string|max:255',
            'precio_rango' => 'nullable|string|max:100',
            'metodos_pago' => 'nullable|array',
            'capacidad_aforo' => 'nullable|integer|min:0',
            'numero_personas_atiende' => 'nullable|integer|min:0',
            'comentarios_resenas' => 'nullable|string',
            'imagenes' => 'nullable|array',
            'categoria' => 'required|string|max:100',
            'certificaciones' => 'nullable|array',
            'idiomas_hablados' => 'nullable|array',
            'opciones_acceso' => 'nullable|string',
            'facilidades_discapacidad' => 'nullable|boolean',
            'asociacion_id' => 'nullable|exists:asociaciones,id',
        ];
        
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            foreach ($rules as $field => $rule) {
                $rules[$field] = 'sometimes|' . $rule;
            }
        }
        
        return $rules;
    }
    
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY)
        );
    }
}