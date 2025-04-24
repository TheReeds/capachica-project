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
                'message' => 'Registro creado exitosamente',
                'data' => $reserva
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

    }

    public function update(Request $request, $id)
    {

        Try{
            $data = $request->validate([
                'nombre' => 'required|string|max:255',
                'fecha' => 'required|date',
                'descripcion' => 'nullable|string',
                'redes_url' => 'nullable|url',
                'tipo' => 'required|string',
            ]);

            

            $reserva = reserva::findOrFail($id);
            DB::beginTransaction();
            
            $reserva->fill($data);
    
            if(!$reserva->save()){
                throw new \Exception('Error al guardar en la base de datos');
            }
    
            DB::commit();
    
            return response()->json([
                'success' => true,
                'message' => 'Registro actualizado exitosamente',
                'data' => $reserva
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
            /*$this->repository->update($id, $data);
            return response()->json(['message' => 'Reserva actualizada correctamente']);*/
    }

    public function destroy($id)
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Reserva eliminada correctamente']);
    }
}
