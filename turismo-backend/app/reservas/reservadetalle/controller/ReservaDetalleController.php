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

    public function index()
    {
        return response()->json($this->repository->all());
    }

    public function show($id)
    {
        return response()->json($this->repository->find($id));
    }

    public function store(Request $request)
    {
        
        Try{
            $data = $request->validate([
                'reserva_id' => 'required|exists:reservas,id',
                'emprendedor_id' => 'required|exists:emprendedores,id',
                'descripcion' => 'required|string',
                'cantidad' => 'required|integer',
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
                'message' => 'Registro creado exitosamente',
                'data' => $reservaDetalle
            ], Response::HTTP_CREATED); // 201 Created
        
            }catch (ValidationException $e) {
                // Si hay errores de validación, revertir la transacción
                DB::rollBack();

                // Retornar errores de validación
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $e->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY); // 422 Unprocessable Entity

            }catch (\Exception $e) {
                // Si hay otras excepciones, revertir la transacción
                DB::rollBack();

                // Registrar el error
                Log::error('Error al guardar datos: ' . $e->getMessage());

                // Retornar respuesta de error
                return response()->json([
                    'success' => false,
                    'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
                ], Response::HTTP_INTERNAL_SERVER_ERROR); // 500 Internal Server Error
            }
        /*$this->repository->create($data);
        return response()->json(['message' => 'Reserva ingresada correctamente']);*/
    }

    public function update(Request $request, $id)
    {
        Try{
            $data = $request->validate([
                'reserva_id' => 'required|exists:reservas,id',
                'emprendedor_id' => 'required|exists:emprendedores,id',
                'descripcion' => 'required|string',
                'cantidad' => 'required|integer',
            ]);
            
            $reservaDetalle = reservaDetalle::findOrFail($id);
            DB::beginTransaction();

            $reservaDetalle->fill($data);

            if(!$reservaDetalle->save()){
                throw new \Exception('Error al guardar en la base de datos');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Registro actualizado exitosamente',
                'data' => $reservaDetalle
            ], Response::HTTP_CREATED); // 201 Created
        
            }catch (ValidationException $e) {
                // Si hay errores de validación, revertir la transacción
                DB::rollBack();

                // Retornar errores de validación
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $e->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY); // 422 Unprocessable Entity

            }catch (\Exception $e) {
                // Si hay otras excepciones, revertir la transacción
                DB::rollBack();

                // Registrar el error
                Log::error('Error al guardar datos: ' . $e->getMessage());

                // Retornar respuesta de error
                return response()->json([
                    'success' => false,
                    'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
                ], Response::HTTP_INTERNAL_SERVER_ERROR); // 500 Internal Server Error
            }
        /*    
        $this->repository->update($id, $data);
        return response()->json(['message' => 'Reserva actualizada correctamente']);*/
    }

    public function destroy($id)
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}
