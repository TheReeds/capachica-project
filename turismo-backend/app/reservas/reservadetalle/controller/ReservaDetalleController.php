<?php
namespace App\reservas\reservadetalle\Controller;

use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\reservas\reservadetalle\Repository\ReservaDetalleRepository;
use App\reservas\reservadetalle\Models\ReservaDetalle;

class ReservaDetalleController extends Controller
{
    protected $repository;

    public function __construct(ReservaDetalleRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Obtener todos los detalles de reserva
     */
    public function index()
    {
        try {
            $detalles = $this->repository->all();
            return response()->json([
                'success' => true,
                'data' => $detalles
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error al obtener detalles de reserva: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener un detalle de reserva específico
     */
    public function show($id)
    {
        try {
            $detalle = $this->repository->find($id);
            return response()->json([
                'success' => true,
                'data' => $detalle
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error al obtener detalle de reserva: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Detalle de reserva no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * Crear un nuevo detalle de reserva
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'reserva_id' => 'required|exists:reservas,id',
                'emprendedor_id' => 'required|exists:emprendedores,id',
                'descripcion' => 'required|string',
                'cantidad' => 'required|integer|min:1',
            ]);
        
            DB::beginTransaction();

            $reservaDetalle = new ReservaDetalle();
            $reservaDetalle->fill($data);

            if(!$reservaDetalle->save()){
                throw new \Exception('Error al guardar en la base de datos');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Detalle de reserva creado exitosamente',
                'data' => $reservaDetalle
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
            Log::error('Error al guardar detalle de reserva: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualizar un detalle de reserva existente
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'reserva_id' => 'sometimes|required|exists:reservas,id',
                'emprendedor_id' => 'sometimes|required|exists:emprendedores,id',
                'descripcion' => 'sometimes|required|string',
                'cantidad' => 'sometimes|required|integer|min:1',
            ]);
            
            $reservaDetalle = ReservaDetalle::findOrFail($id);
            DB::beginTransaction();

            $reservaDetalle->fill($data);

            if(!$reservaDetalle->save()){
                throw new \Exception('Error al actualizar en la base de datos');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Detalle de reserva actualizado exitosamente',
                'data' => $reservaDetalle
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
            Log::error('Error al actualizar detalle de reserva: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar un detalle de reserva
     */
    public function destroy($id)
    {
        try {
            $this->repository->delete($id);
            return response()->json([
                'success' => true,
                'message' => 'Detalle de reserva eliminado correctamente'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error al eliminar detalle de reserva: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el detalle de reserva: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener detalles por reserva
     */
    public function getByReserva($reservaId)
    {
        try {
            $detalles = $this->repository->getByReserva($reservaId);
            return response()->json([
                'success' => true,
                'data' => $detalles
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error al obtener detalles por reserva: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener detalles por emprendedor
     */
    public function getByEmprendedor($emprendedorId)
    {
        try {
            $detalles = $this->repository->getByEmprendedor($emprendedorId);
            return response()->json([
                'success' => true,
                'data' => $detalles
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error al obtener detalles por emprendedor: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}