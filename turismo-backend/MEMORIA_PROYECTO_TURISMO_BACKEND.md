# MEMORIA DEL PROYECTO TURISMO BACKEND

## 1. DESCRIPCIÓN GENERAL DEL PROYECTO

### 1.1 Propósito
El proyecto **Turismo Backend** es una API REST desarrollada en Laravel 12 que gestiona un sistema de turismo comunitario. Permite a emprendedores locales crear y gestionar planes turísticos, servicios, reservas y eventos, facilitando la conexión entre turistas y experiencias locales auténticas.

### 1.2 Tecnologías Principales
- **Framework**: Laravel 12 (PHP 8.2+)
- **Base de Datos**: SQLite (desarrollo) / MySQL/PostgreSQL (producción)
- **Autenticación**: Laravel Sanctum + Spatie Laravel Permission
- **Autenticación Social**: Google OAuth
- **Documentación API**: Scramble
- **Procesamiento de Imágenes**: Intervention Image
- **Testing**: PHPUnit

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Estructura de Directorios
```
turismo-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/API/     # Controladores de la API
│   │   ├── Middleware/          # Middlewares personalizados
│   │   ├── Requests/            # Validaciones de formularios
│   │   └── Resources/           # Transformadores de datos
│   ├── Models/                  # Modelos Eloquent
│   ├── Services/                # Lógica de negocio
│   ├── Repository/              # Patrón Repository
│   ├── Notifications/           # Notificaciones por email
│   └── Traits/                  # Traits reutilizables
├── database/
│   ├── migrations/              # Migraciones de BD
│   ├── seeders/                 # Datos de prueba
│   └── factories/               # Factories para testing
├── routes/
│   └── api.php                  # Rutas de la API
└── config/                      # Configuraciones
```

### 2.2 Patrones de Diseño Utilizados
- **MVC (Model-View-Controller)**: Arquitectura base de Laravel
- **Repository Pattern**: Para abstracción de acceso a datos
- **Service Layer**: Para lógica de negocio compleja
- **Resource Pattern**: Para transformación de datos de respuesta
- **Trait Pattern**: Para funcionalidades reutilizables

## 3. MODELOS PRINCIPALES Y RELACIONES

### 3.1 User (Usuario)
**Propósito**: Gestión de usuarios del sistema
**Campos principales**:
- `name`, `email`, `password`
- `phone`, `foto_perfil`, `google_id`
- `country`, `birth_date`, `address`, `gender`
- `preferred_language`, `last_login`

**Relaciones clave**:
- `emprendimientos()`: Emprendimientos que administra
- `planesCreados()`: Planes creados por el usuario
- `inscripciones()`: Inscripciones a planes
- `planesInscritos()`: Planes a los que está inscrito

### 3.2 Emprendedor
**Propósito**: Representa negocios/emprendimientos turísticos locales
**Campos principales**:
- `nombre`, `tipo_servicio`, `descripcion`
- `ubicacion`, `telefono`, `email`, `pagina_web`
- `horario_atencion`, `precio_rango`
- `metodos_pago`, `capacidad_aforo`
- `certificaciones`, `idiomas_hablados`
- `facilidades_discapacidad`, `estado`

**Relaciones clave**:
- `asociacion()`: Asociación a la que pertenece
- `administradores()`: Usuarios que administran el emprendimiento
- `servicios()`: Servicios ofrecidos
- `planesParticipando()`: Planes donde participa
- `eventos()`: Eventos organizados

### 3.3 Plan
**Propósito**: Planes turísticos que combinan múltiples servicios
**Campos principales**:
- `nombre`, `descripcion`, `que_incluye`
- `capacidad`, `duracion_dias`, `es_publico`
- `estado`, `precio_total`, `dificultad`
- `requerimientos`, `que_llevar`
- `imagen_principal`, `imagenes_galeria`

**Relaciones clave**:
- `creadoPor()`: Usuario que creó el plan
- `emprendedores()`: Emprendedores participantes (múltiples)
- `dias()`: Días del plan con servicios
- `inscripciones()`: Inscripciones de usuarios
- `usuariosInscritos()`: Usuarios inscritos

### 3.4 Servicio
**Propósito**: Servicios individuales ofrecidos por emprendedores
**Campos principales**:
- `nombre`, `descripcion`, `precio_referencial`
- `emprendedor_id`, `estado`, `capacidad`
- `latitud`, `longitud`, `ubicacion_referencia`

**Relaciones clave**:
- `emprendedor()`: Emprendedor que ofrece el servicio
- `categorias()`: Categorías del servicio
- `horarios()`: Horarios de disponibilidad
- `reservas()`: Reservas del servicio

### 3.5 Reserva
**Propósito**: Reservas de servicios por parte de usuarios
**Campos principales**:
- `usuario_id`, `codigo_reserva`
- `estado`, `notas`

**Estados**: `en_carrito`, `pendiente`, `confirmada`, `cancelada`, `completada`

**Relaciones clave**:
- `usuario()`: Usuario que hizo la reserva
- `servicios()`: Servicios reservados (ReservaServicio)

### 3.6 PlanInscripcion
**Propósito**: Inscripciones de usuarios a planes turísticos
**Campos principales**:
- `plan_id`, `user_id`, `estado`
- `fecha_inscripcion`, `fecha_inicio_plan`, `fecha_fin_plan`
- `numero_participantes`, `precio_pagado`
- `metodo_pago`, `requerimientos_especiales`

## 4. SISTEMA DE AUTENTICACIÓN Y AUTORIZACIÓN

### 4.1 Autenticación
- **Laravel Sanctum**: Para autenticación API con tokens
- **Google OAuth**: Autenticación social
- **Verificación de Email**: Obligatoria para usuarios registrados
- **Recuperación de Contraseña**: Sistema completo de reset

### 4.2 Autorización
- **Spatie Laravel Permission**: Sistema de roles y permisos
- **Roles principales**:
  - `admin`: Administrador del sistema
  - `emprendedor`: Emprendedor local
  - `turista`: Usuario turista
- **Permisos granulares**: Control específico por funcionalidad

### 4.3 Middleware de Seguridad
- `auth:sanctum`: Verificación de autenticación
- `permission:*`: Verificación de permisos específicos
- `ApiAuthenticate`: Middleware personalizado para respuestas JSON

## 5. ENDPOINTS PRINCIPALES DE LA API

### 5.1 Autenticación (`/api/auth/`)
- `POST /register`: Registro de usuarios
- `POST /login`: Inicio de sesión
- `POST /logout`: Cierre de sesión
- `GET /profile`: Perfil del usuario
- `PUT /profile`: Actualizar perfil
- `POST /forgot-password`: Recuperar contraseña
- `POST /reset-password`: Resetear contraseña

### 5.2 Google OAuth (`/api/auth/google/`)
- `GET /`: Redirección a Google
- `GET /callback`: Callback de Google
- `POST /verify-token`: Verificar token de Google

### 5.3 Emprendedores (`/api/emprendedores/`)
- `GET /`: Listar emprendedores (público)
- `GET /{id}`: Ver emprendedor específico
- `POST /`: Crear emprendedor (protegido)
- `PUT /{id}`: Actualizar emprendedor
- `DELETE /{id}`: Eliminar emprendedor
- `GET /{id}/servicios`: Servicios del emprendedor
- `GET /{id}/reservas`: Reservas del emprendedor

### 5.4 Planes (`/api/planes/`)
- `GET /`: Listar planes con filtros
- `GET /publicos`: Planes públicos para catálogo
- `POST /`: Crear plan (protegido)
- `GET /{id}`: Ver plan específico
- `PUT /{id}`: Actualizar plan
- `DELETE /{id}`: Eliminar plan
- `PATCH /{id}/estado`: Cambiar estado del plan

### 5.5 Inscripciones (`/api/inscripciones/`)
- `GET /mis-inscripciones`: Mis inscripciones
- `GET /proximas`: Próximas inscripciones
- `GET /en-progreso`: Inscripciones en progreso
- `POST /`: Inscribirse a un plan
- `PATCH /{id}/cancelar`: Cancelar inscripción
- `PATCH /{id}/completar`: Marcar como completada

### 5.6 Reservas (`/api/reservas/`)
- `GET /`: Listar reservas
- `POST /`: Crear reserva
- `GET /{id}`: Ver reserva específica
- `PUT /{id}`: Actualizar reserva
- `DELETE /{id}`: Eliminar reserva
- `GET /carrito`: Obtener carrito de compras
- `POST /carrito/agregar`: Agregar al carrito
- `POST /carrito/confirmar`: Confirmar carrito

### 5.7 Servicios (`/api/servicios/`)
- `GET /`: Listar servicios
- `GET /{id}`: Ver servicio específico
- `POST /`: Crear servicio (protegido)
- `PUT /{id}`: Actualizar servicio
- `DELETE /{id}`: Eliminar servicio
- `GET /verificar-disponibilidad`: Verificar disponibilidad

### 5.8 Administración (`/api/admin/`)
- `GET /users`: Gestión de usuarios
- `GET /roles`: Gestión de roles
- `GET /permissions`: Gestión de permisos
- `GET /dashboard/summary`: Resumen del dashboard

## 6. LÓGICA DE NEGOCIO PRINCIPAL

### 6.1 Gestión de Planes Turísticos
**Características**:
- **Múltiples emprendedores**: Un plan puede involucrar varios emprendedores
- **Roles en planes**: Organizador principal y colaboradores
- **Días estructurados**: Cada plan tiene días con servicios específicos
- **Cupos limitados**: Control de capacidad por plan
- **Estados**: Activo, inactivo, borrador

**Flujo de creación**:
1. Usuario crea plan con información básica
2. Agrega emprendedores participantes con roles
3. Define días del plan con servicios específicos
4. Establece precios y capacidad
5. Publica el plan

### 6.2 Sistema de Reservas
**Características**:
- **Carrito de compras**: Agregar múltiples servicios
- **Verificación de disponibilidad**: Antes de confirmar
- **Estados de reserva**: En carrito, pendiente, confirmada, etc.
- **Códigos únicos**: Para identificación de reservas

**Flujo de reserva**:
1. Usuario agrega servicios al carrito
2. Sistema verifica disponibilidad
3. Usuario confirma reserva
4. Se genera código único
5. Se notifica al emprendedor

### 6.3 Gestión de Emprendedores
**Características**:
- **Múltiples administradores**: Varios usuarios pueden administrar un emprendimiento
- **Asociaciones**: Emprendedores pueden pertenecer a asociaciones
- **Servicios múltiples**: Cada emprendedor puede ofrecer varios servicios
- **Horarios flexibles**: Configuración de disponibilidad por día

### 6.4 Sistema de Inscripciones
**Características**:
- **Inscripción a planes**: Usuarios se inscriben a planes completos
- **Estados de inscripción**: Pendiente, confirmada, cancelada, completada
- **Múltiples participantes**: Una inscripción puede incluir varias personas
- **Pagos**: Registro de pagos y métodos de pago

## 7. SERVICIOS Y REPOSITORIOS

### 7.1 PlanService
**Responsabilidades**:
- Creación y actualización de planes
- Gestión de emprendedores en planes
- Procesamiento de imágenes
- Cálculo de estadísticas
- Búsqueda y filtrado

### 7.2 AuthService
**Responsabilidades**:
- Registro y autenticación de usuarios
- Gestión de perfiles
- Integración con Google OAuth
- Verificación de emails

### 7.3 EmprendedoresService
**Responsabilidades**:
- Gestión de emprendimientos
- Administración de usuarios
- Estadísticas de emprendedores

### 7.4 Repository Pattern
**Repositorios implementados**:
- `ReservaRepository`: Gestión de reservas
- `ServicioRepository`: Gestión de servicios
- `CategoriaRepository`: Gestión de categorías
- `EventoRepository`: Gestión de eventos

## 8. SISTEMA DE NOTIFICACIONES

### 8.1 Tipos de Notificaciones
- **Verificación de Email**: Al registrarse
- **Reset de Contraseña**: Recuperación de cuenta
- **Confirmación de Reserva**: Notificación a emprendedores
- **Recordatorios de Planes**: Próximos eventos

### 8.2 Implementación
- **Laravel Notifications**: Sistema base
- **Mail**: Envío por email
- **Templates Blade**: Plantillas personalizadas

## 9. GESTIÓN DE ARCHIVOS E IMÁGENES

### 9.1 Procesamiento de Imágenes
- **Intervention Image**: Procesamiento y optimización
- **Formato WebP**: Optimización automática
- **Múltiples tamaños**: Diferentes resoluciones
- **Almacenamiento**: Sistema de archivos configurable

### 9.2 Tipos de Imágenes
- **Fotos de perfil**: Usuarios y emprendedores
- **Imágenes de servicios**: Galerías de servicios
- **Imágenes de planes**: Imágenes principales y galerías
- **Sliders**: Imágenes promocionales

## 10. SISTEMA DE BÚSQUEDA Y FILTROS

### 10.1 Búsqueda de Emprendedores
- Por ubicación geográfica
- Por categoría de servicio
- Por asociación
- Por nombre o descripción

### 10.2 Filtros de Planes
- Por emprendedor organizador
- Por dificultad
- Por duración
- Por rango de precios
- Por disponibilidad de cupos

### 10.3 Búsqueda de Servicios
- Por emprendedor
- Por categoría
- Por ubicación
- Por disponibilidad temporal

## 11. SEGURIDAD Y VALIDACIÓN

### 11.1 Validación de Datos
- **Form Requests**: Validación específica por endpoint
- **Reglas personalizadas**: Validaciones de negocio
- **Sanitización**: Limpieza de datos de entrada

### 11.2 Seguridad
- **CSRF Protection**: Protección contra ataques CSRF
- **Rate Limiting**: Limitación de requests
- **Input Sanitization**: Sanitización de entradas
- **SQL Injection Protection**: Eloquent ORM

### 11.3 Permisos Granulares
- **CRUD Operations**: Permisos específicos por operación
- **Resource-based**: Permisos por recurso
- **Role-based**: Permisos por rol de usuario

## 12. TESTING Y CALIDAD

### 12.1 Testing Implementado
- **Unit Tests**: Pruebas de modelos y servicios
- **Feature Tests**: Pruebas de endpoints
- **Factories**: Generación de datos de prueba
- **Seeders**: Datos iniciales para testing

### 12.2 Cobertura de Testing
- **Modelos**: Validación de relaciones y scopes
- **Servicios**: Lógica de negocio
- **Controladores**: Endpoints de la API
- **Validaciones**: Form Requests

## 13. CONFIGURACIÓN Y DESPLIEGUE

### 13.1 Configuración de Base de Datos
- **SQLite**: Desarrollo local
- **MySQL/PostgreSQL**: Producción
- **Migraciones**: Control de versiones de BD
- **Seeders**: Datos iniciales

### 13.2 Variables de Entorno
- **APP_ENV**: Entorno de aplicación
- **DB_CONNECTION**: Tipo de base de datos
- **GOOGLE_CLIENT_ID**: OAuth de Google
- **MAIL_MAILER**: Configuración de email

### 13.3 Despliegue
- **Docker**: Containerización
- **Nginx**: Servidor web
- **Supervisor**: Gestión de procesos
- **Render**: Plataforma de despliegue

## 14. MONITOREO Y LOGGING

### 14.1 Logging
- **Laravel Logging**: Sistema integrado
- **Niveles de log**: Error, warning, info, debug
- **Rotación**: Gestión automática de archivos

### 14.2 Monitoreo
- **Health Checks**: Endpoints de estado
- **Performance Monitoring**: Monitoreo de rendimiento
- **Error Tracking**: Seguimiento de errores

## 15. ESCALABILIDAD Y OPTIMIZACIÓN

### 15.1 Optimizaciones Implementadas
- **Eager Loading**: Carga eficiente de relaciones
- **Database Indexing**: Índices optimizados
- **Caching**: Cache de consultas frecuentes
- **Image Optimization**: Optimización de imágenes

### 15.2 Consideraciones de Escalabilidad
- **Horizontal Scaling**: Preparado para múltiples instancias
- **Database Sharding**: Posibilidad de particionamiento
- **CDN Integration**: Distribución de contenido
- **Queue System**: Procesamiento asíncrono

## 16. DOCUMENTACIÓN Y MANTENIMIENTO

### 16.1 Documentación API
- **Scramble**: Documentación automática
- **OpenAPI/Swagger**: Especificación estándar
- **Ejemplos de uso**: Casos de uso documentados

### 16.2 Mantenimiento
- **Versionado**: Control de versiones con Git
- **Backup Strategy**: Estrategia de respaldos
- **Update Procedures**: Procedimientos de actualización
- **Monitoring**: Monitoreo continuo

## 17. CONCLUSIONES

El proyecto **Turismo Backend** representa una solución completa y robusta para la gestión de turismo comunitario. Su arquitectura modular, sistema de permisos granular y funcionalidades avanzadas lo convierten en una plataforma escalable y mantenible.

### 17.1 Fortalezas del Sistema
- **Arquitectura sólida**: Patrones de diseño bien implementados
- **Seguridad robusta**: Múltiples capas de seguridad
- **Escalabilidad**: Preparado para crecimiento
- **Flexibilidad**: Adaptable a diferentes necesidades
- **Mantenibilidad**: Código bien estructurado y documentado

### 17.2 Áreas de Mejora Futura
- **Implementación de pagos**: Integración con gateways de pago
- **Notificaciones push**: Notificaciones en tiempo real
- **Analytics avanzados**: Métricas detalladas de uso
- **API GraphQL**: Para consultas más eficientes
- **Microservicios**: Separación en servicios independientes

### 17.3 Impacto del Proyecto
Este sistema facilita la conexión entre turistas y emprendedores locales, promoviendo el turismo sostenible y el desarrollo económico de las comunidades locales. La plataforma empodera a los emprendedores para gestionar sus servicios de manera profesional mientras proporciona a los turistas acceso a experiencias auténticas y únicas. 