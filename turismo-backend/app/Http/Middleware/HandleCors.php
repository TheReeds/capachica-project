<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Obtener la configuración CORS desde config/cors.php
        $allowedOrigins = config('cors.allowed_origins');
        $allowedMethods = config('cors.allowed_methods');
        $allowedHeaders = config('cors.allowed_headers');
        $exposedHeaders = config('cors.exposed_headers');
        $maxAge = config('cors.max_age');
        $supportsCredentials = config('cors.supports_credentials');

        // Procesar la solicitud normalmente para obtener la respuesta
        $response = $next($request);

        // Manejar las solicitudes OPTIONS (pre-vuelo)
        if ($request->isMethod('OPTIONS')) {
            $response->header('Access-Control-Allow-Headers', implode(', ', $allowedHeaders));
            $response->header('Access-Control-Allow-Methods', implode(', ', $allowedMethods));
            $response->header('Access-Control-Max-Age', $maxAge);
        }

        // Establecer el encabezado Access-Control-Allow-Origin
        $origin = $request->headers->get('Origin');
        if (in_array('*', $allowedOrigins) || in_array($origin, $allowedOrigins)) {
            $response->header('Access-Control-Allow-Origin', $origin ?: '*');
        } else {
            // Si el origen no está permitido, no se establece el encabezado.
            // Esto es importante para que el navegador bloquee la solicitud.
        }

        // Establecer Access-Control-Allow-Credentials si está habilitado
        if ($supportsCredentials) {
            $response->header('Access-Control-Allow-Credentials', 'true');
        }

        // Establecer Access-Control-Expose-Headers si hay encabezados expuestos
        if (!empty($exposedHeaders)) {
            $response->header('Access-Control-Expose-Headers', implode(', ', $exposedHeaders));
        }

        return $response;
    }
}
