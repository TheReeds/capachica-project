<?php
namespace App\reservas\reserva\Controller;

use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\reservas\reserva\Repository\ReservaRepository;
use Illuminate\Support\Facades\Log;
use Exception;
use App\reservas\reserva\Models\Reserva;


class ReservaController extends Controller
{
    protected $repository;

    public function __construct(ReservaRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Obtener todas las reservas
     */
    public function index()
    {
        try {
            $reservas = $this->repository->all();
            return response()->json([
                'success' => true,
                'data' => $reservas
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error('Error al obtener reservas: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener una reserva específica
     */
    public function show($id)
    {
        try {
            $reserva = $this->repository->find($id);
            return response()->json([
                'success' => true,
                'data' => $reserva
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error('Error al obtener reserva: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Reserva no encontrada'
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * Crear una nueva reserva
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'nombre' => 'required|string|max:255',
                'fecha' => 'required|date',
                'descripcion' => 'nullable|string',
                'redes_url' => 'nullable|url',
                'tipo' => 'required|string',
            ]);
        
            DB::beginTransaction();

            $reserva = new Reserva();
            $reserva->fill($data);

            if(!$reserva->save()){
                throw new \Exception('Error al guardar en la base de datos');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Reserva creada exitosamente',
                'data' => $reserva
            ], Response::HTTP_CREATED);
        
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al guardar reserva: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualizar una reserva existente
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'nombre' => 'sometimes|required|string|max:255',
                'fecha' => 'sometimes|required|date',
                'descripcion' => 'nullable|string',
                'redes_url' => 'nullable|url',
                'tipo' => 'sometimes|required|string',
            ]);

            $reserva = Reserva::findOrFail($id);
            DB::beginTransaction();
            
            $reserva->fill($data);
    
            if (!$reserva->save()) {
                throw new \Exception('Error al actualizar en la base de datos');
            }
    
            DB::commit();
    
            return response()->json([
                'success' => true,
                'message' => 'Reserva actualizada exitosamente',
                'data' => $reserva
            ], Response::HTTP_OK);
            
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al actualizar reserva: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar una reserva
     */
    public function destroy($id)
    {
        try {
            $this->repository->delete($id);
            return response()->json([
                'success' => true,
                'message' => 'Reserva eliminada correctamente'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error al eliminar reserva: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la reserva: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener los emprendedores de una reserva
     */
    public function getEmprendedores($id)
    {
        try {
            $reserva = $this->repository->findWithEmprendedores($id);
            return response()->json([
                'success' => true,
                'data' => $reserva->emprendedores
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error al obtener emprendedores de la reserva: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener datos: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}