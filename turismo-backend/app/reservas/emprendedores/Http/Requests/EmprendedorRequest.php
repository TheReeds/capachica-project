<?php

namespace App\reservas\Emprendedores\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;
use Illuminate\Foundation\Http\FormRequest;

class EmprendedorRequest extends FormRequest
{
    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        // Convertir metodos_pago que viene como string JSON a array
        if ($this->has('metodos_pago') && is_string($this->metodos_pago)) {
            if (is_array(json_decode($this->metodos_pago, true))) {
                $this->merge([
                    'metodos_pago' => json_decode($this->metodos_pago, true)
                ]);
            }
        }
        
        // Convertir idiomas_hablados que viene como string a array
        if ($this->has('idiomas_hablados') && is_string($this->idiomas_hablados)) {
            $idiomas = array_map('trim', explode(',', $this->idiomas_hablados));
            $this->merge([
                'idiomas_hablados' => $idiomas
            ]);
        }
        
        // Asegurar que facilidades_discapacidad sea booleano
        if ($this->has('facilidades_discapacidad')) {
            $this->merge([
                'facilidades_discapacidad' => filter_var($this->facilidades_discapacidad, FILTER_VALIDATE_BOOLEAN)
            ]);
        }
    }

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
            
            // Validaciones para sliders
            'sliders_principales' => 'nullable|array',
            'sliders_principales.*.id' => 'nullable|integer|exists:sliders,id',
            'sliders_principales.*.nombre' => 'required|string|max:255',
            'sliders_principales.*.orden' => 'required|integer|min:1',
            'sliders_principales.*.imagen' => 'nullable|file|mimes:jpg,jpeg,png,gif|max:5120',
            
            'sliders_secundarios' => 'nullable|array',
            'sliders_secundarios.*.id' => 'nullable|integer|exists:sliders,id',
            'sliders_secundarios.*.nombre' => 'required|string|max:255',
            'sliders_secundarios.*.orden' => 'required|integer|min:1',
            'sliders_secundarios.*.titulo' => 'required|string|max:255',
            'sliders_secundarios.*.descripcion' => 'nullable|string',
            'sliders_secundarios.*.imagen' => 'nullable|file|mimes:jpg,jpeg,png,gif|max:5120',
            
            'deleted_sliders' => 'nullable|array',
            'deleted_sliders.*' => 'integer|exists:sliders,id',
        ];
        
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            foreach ($rules as $field => $rule) {
                // No aplicar 'sometimes' a reglas de arreglos anidados
                if (!strpos($field, '.*')) {
                    $rules[$field] = 'sometimes|' . $rule;
                }
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