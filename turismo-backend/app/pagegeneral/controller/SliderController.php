<?php

namespace App\pagegeneral\controller;

use App\Http\Controllers\Controller;
use App\pagegeneral\Repository\SliderRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SliderController extends Controller
{
    protected $sliderRepository;

    public function __construct(SliderRepository $sliderRepository)
    {
        $this->sliderRepository = $sliderRepository;
    }

    public function index()
    {
        $sliders = $this->sliderRepository->getAll();
        return response()->json(['data' => $sliders], 200);
    }

    public function show($id)
    {
        try {
            $slider = $this->sliderRepository->getById($id);
            return response()->json(['data' => $slider], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Slider no encontrado'], 404);
        }
    }

    public function getImage($id)
    {
        try {
            $slider = $this->sliderRepository->getById($id);
            $imagePath = public_path($slider->ruta_url);
            
            if (file_exists($imagePath)) {
                return response()->file($imagePath);
            }
            
            return response()->json(['message' => 'Imagen no encontrada'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Slider no encontrado'], 404);
        }
    }

    public function store(Request $request)
    {
        // Validación de los campos, incluyendo la imagen
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'coordenadas' => 'nullable|string|max:255',
            'coordenada_y' => 'nullable|string|max:255',
            'campo' => 'nullable|string|max:255',
            'municipalidad_id' => 'required|exists:municipalidad,id',
            'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Si la validación falla, se devuelve un error
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        try {
            // Generar un nombre único para la imagen
            $fileName = time() . '_' . $request->file('imagen')->getClientOriginalName();
            
            // Definir la carpeta directamente en public
            $publicPath = public_path('uploads/imagen');
            
            // Crear el directorio si no existe
            if (!file_exists($publicPath)) {
                mkdir($publicPath, 0775, true);
            }
            
            // Mover el archivo directamente
            $request->file('imagen')->move($publicPath, $fileName);
            
            // URL relativa para la base de datos
            $publicUrl = 'uploads/imagen/' . $fileName;
            
            // Guardar en la base de datos
            $sliderData = $request->all();
            $sliderData['ruta_url'] = $publicUrl;
            
            // Crear el slider
            $slider = $this->sliderRepository->create($sliderData);
            
            return response()->json([
                'data' => $slider, 
                'message' => 'Slider creado con éxito',
                'debug' => [
                    'file_exists' => file_exists($publicPath . '/' . $fileName),
                    'file_path' => $publicPath . '/' . $fileName,
                    'public_url' => asset($publicUrl)
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al guardar la imagen',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|string|max:255',
            'coordenadas' => 'nullable|string|max:255',
            'coordenada_y' => 'nullable|string|max:255',
            'campo' => 'nullable|string|max:255',
            'municipalidad_id' => 'sometimes|exists:municipalidad,id',
            'imagen' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $slider = $this->sliderRepository->getById($id);
            $sliderData = $request->all();

            // Si se envía una nueva imagen
            if ($request->hasFile('imagen')) {
                // Eliminar la imagen anterior si existe
                $oldImagePath = public_path($slider->ruta_url);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }

                // Generar un nombre único para la nueva imagen
                $fileName = time() . '_' . $request->file('imagen')->getClientOriginalName();
                
                // Definir la carpeta directamente en public
                $publicPath = public_path('uploads/imagen');
                
                // Crear el directorio si no existe
                if (!file_exists($publicPath)) {
                    mkdir($publicPath, 0775, true);
                }
                
                // Mover el archivo directamente
                $request->file('imagen')->move($publicPath, $fileName);
                
                // URL relativa para la base de datos
                $publicUrl = 'uploads/imagen/' . $fileName;
                
                // Actualizar la ruta en los datos
                $sliderData['ruta_url'] = $publicUrl;
            }

            $updatedSlider = $this->sliderRepository->update($id, $sliderData);
            return response()->json(['data' => $updatedSlider, 'message' => 'Slider actualizado con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Slider no encontrado', 
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $slider = $this->sliderRepository->getById($id);
            $imagePath = public_path($slider->ruta_url);
            
            // Eliminar la imagen del sistema de archivos si existe
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
            
            $this->sliderRepository->delete($id);
            return response()->json(['message' => 'Slider eliminado con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Slider no encontrado'], 404);
        }
    }

    public function getByMunicipalidadId($municipalidadId)
    {
        $sliders = $this->sliderRepository->getByMunicipalidadId($municipalidadId);
        return response()->json(['data' => $sliders], 200);
    }

    public function getWithDescripciones($id)
    {
        try {
            $slider = $this->sliderRepository->getWithDescripciones($id);
            return response()->json(['data' => $slider], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Slider no encontrado'], 404);
        }
    }
}