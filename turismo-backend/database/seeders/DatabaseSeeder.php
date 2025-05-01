<?php

namespace Database\Seeders;

use App\Models\User;
use App\Servicios\Models\Categoria;
use App\Pagegeneral\Models\Municipalidad;
use App\Reservas\Asociaciones\Models\Asociacion;
use App\Servicios\Models\Servicio;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\reservas\Emprendedores\Models\Emprendedor;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear roles y permisos
        $this->createRolesAndPermissions();
        
        // Crear usuarios admin y usuario normal
        $this->createUsers();
        
        // Crear datos de municipalidad
        $this->createMunicipalidad();
        
        // Crear categorías
        $this->createCategorias();
        
        // Crear asociaciones
        $this->createAsociaciones();
        
        // Crear emprendedores
        $this->createEmprendedores();
        
        // Crear servicios
        $this->createServicios();
        
        // Ejecutar el seeder para asociar usuarios con emprendimientos
        $this->call(UserEmprendedorSeeder::class);
    }
    
    private function createRolesAndPermissions()
    {
        // Crear permisos
        $permissions = [
            'user_create', 'user_read', 'user_update', 'user_delete',
            'role_create', 'role_read', 'role_update', 'role_delete',
            'permission_read', 'permission_assign',
            'emprendedor_create', 'emprendedor_read', 'emprendedor_update', 'emprendedor_delete',
            'servicio_create', 'servicio_read', 'servicio_update', 'servicio_delete',
            'categoria_create', 'categoria_read', 'categoria_update', 'categoria_delete',
            'asociacion_create', 'asociacion_read', 'asociacion_update', 'asociacion_delete',
            'municipalidad_update', 'municipalidad_read'
        ];
        
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
        
        // Crear roles
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'user']);
        $emprendedorRole = Role::create(['name' => 'emprendedor']);
        
        // Asignar todos los permisos al rol admin
        $adminRole->givePermissionTo(Permission::all());
        
        // Asignar permisos limitados al rol user
        $userRole->givePermissionTo([
            'user_read', 'emprendedor_read', 'servicio_read', 
            'categoria_read', 'asociacion_read', 'municipalidad_read'
        ]);
        
        // Asignar permisos de emprendedor
        $emprendedorRole->givePermissionTo([
            'emprendedor_read', 'servicio_create', 'servicio_read', 
            'servicio_update', 'servicio_delete'
        ]);
    }
    
    private function createUsers()
    {
        // Usuario administrador
        $admin = User::create([
            'name' => 'Administrador',
            'first_name' => 'Admin',
            'last_name' => 'Sistema',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'phone' => '123456789',
            'active' => true
        ]);
        $admin->assignRole('admin');
        
        // Usuario normal
        $user = User::create([
            'name' => 'Usuario Normal',
            'first_name' => 'Usuario',
            'last_name' => 'Prueba',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'phone' => '987654321',
            'active' => true
        ]);
        $user->assignRole('user');
        
        // Usuario emprendedor
        $emprendedor = User::create([
            'name' => 'Emprendedor Local',
            'first_name' => 'Juan',
            'last_name' => 'Mamani',
            'email' => 'emprendedor@example.com',
            'password' => Hash::make('password'),
            'phone' => '555444333',
            'active' => true
        ]);
        $emprendedor->assignRole('emprendedor');
    }
    
    private function createMunicipalidad()
    {
        Municipalidad::create([
            'nombre' => 'Municipalidad Distrital de Capachica',
            'descripcion' => 'La Municipalidad Distrital de Capachica es una institución pública que vela por el desarrollo sostenible del distrito a través de la promoción del turismo, conservación del medio ambiente y mejora de la calidad de vida de sus pobladores.',
            'red_facebook' => 'https://facebook.com/municipalidadcapachica',
            'red_instagram' => 'https://instagram.com/municapachica',
            'red_youtube' => 'https://youtube.com/municapachica',
            'coordenadas_x' => -15.6425,
            'coordenadas_y' => -69.8330,
            'frase' => '¡Bienvenidos a Capachica, Paraíso Turístico del Lago Titicaca!',
            'comunidades' => 'Capachica cuenta con 16 comunidades: Llachón, Cotos, Siale, Hilata, Isañura, San Cristóbal, Escallani, Chillora, Yapura, Collasuyo, Miraflores, Villa Lago, Capano, Ccotos, Yancaco y Central.',
            'historiafamilias' => 'Las familias de Capachica han mantenido sus tradiciones ancestrales por generaciones, dedicándose principalmente a la agricultura, pesca y ahora al turismo vivencial.',
            'historiacapachica' => 'Capachica es una península situada en el lago Titicaca con una rica historia preinca e inca. Durante la colonia española, se establecieron haciendas que luego dieron paso a comunidades campesinas que hoy preservan su cultura y patrimonio.',
            'comite' => 'El comité de desarrollo turístico de Capachica está formado por representantes de las comunidades, emprendedores locales y autoridades municipales.',
            'mision' => 'Promover el desarrollo sostenible del distrito mediante la gestión eficiente de recursos, servicios públicos de calidad y promoción del turismo vivencial, respetando la identidad cultural y el medio ambiente.',
            'vision' => 'Al 2030, ser un distrito modelo en turismo sostenible, con infraestructura adecuada, servicios de calidad y una población con mejor calidad de vida, preservando su identidad cultural y recursos naturales.',
            'valores' => 'Honestidad, Transparencia, Respeto al medio ambiente, Identidad cultural, Trabajo en equipo, Compromiso social',
            'ordenanzamunicipal' => 'Ordenanza Municipal N° 015-2023-MDP que regula la actividad turística y establece estándares para la prestación de servicios turísticos en el distrito.',
            'alianzas' => 'Trabajamos en alianza con MINCETUR, DIRCETUR Puno, Programa TRC, PNUD, GIZ, y diversas universidades para la capacitación de emprendedores y promoción del turismo.',
            'correo' => 'informes@municapachica.gob.pe',
            'horariodeatencion' => 'Lunes a Viernes: 8:00 am - 4:00 pm'
        ]);
    }
    
    private function createCategorias()
    {
        $categorias = [
            [
                'nombre' => 'Alojamiento',
                'descripcion' => 'Diferentes opciones de hospedaje, desde casas rurales hasta ecolodges.',
                'icono_url' => 'icons/alojamiento.svg'
            ],
            [
                'nombre' => 'Alimentación',
                'descripcion' => 'Restaurantes y servicios de comida tradicional de la región.',
                'icono_url' => 'icons/alimentacion.svg'
            ],
            [
                'nombre' => 'Artesanía',
                'descripcion' => 'Productos hechos a mano por artesanos locales.',
                'icono_url' => 'icons/artesania.svg'
            ],
            [
                'nombre' => 'Transporte',
                'descripcion' => 'Servicios de transporte terrestre y lacustre.',
                'icono_url' => 'icons/transporte.svg'
            ],
            [
                'nombre' => 'Actividades',
                'descripcion' => 'Experiencias y actividades turísticas.',
                'icono_url' => 'icons/actividades.svg'
            ],
            [
                'nombre' => 'Guiado',
                'descripcion' => 'Servicios de guías turísticos locales.',
                'icono_url' => 'icons/guiado.svg'
            ]
        ];
        
        foreach ($categorias as $categoria) {
            Categoria::create($categoria);
        }
    }
    
    private function createAsociaciones()
    {
        $asociaciones = [
            [
                'nombre' => 'Asociación de Turismo Vivencial Llachón',
                'descripcion' => 'Grupo de familias que ofrecen servicios de turismo vivencial en la comunidad de Llachón.',
                'ubicacion' => 'Comunidad Llachón, Capachica',
                'telefono' => '951234567',
                'email' => 'turvivllachon@gmail.com',
                'municipalidad_id' => 1
            ],
            [
                'nombre' => 'Asociación de Artesanos de Capachica',
                'descripcion' => 'Reúne a artesanos tradicionales que elaboran textiles, cerámica y otros productos artesanales.',
                'ubicacion' => 'Plaza Principal, Capachica',
                'telefono' => '951987654',
                'email' => 'artesanoscapachica@gmail.com',
                'municipalidad_id' => 1
            ],
            [
                'nombre' => 'Asociación de Turismo Rural Comunitario Isla Ticonata',
                'descripcion' => 'Familias que ofrecen servicios turísticos en la isla Ticonata.',
                'ubicacion' => 'Isla Ticonata, Capachica',
                'telefono' => '952345678',
                'email' => 'ticonata.trc@gmail.com',
                'municipalidad_id' => 1
            ]
        ];
        
        foreach ($asociaciones as $asociacion) {
            Asociacion::create($asociacion);
        }
    }
    
    private function createEmprendedores()
    {
        $emprendedores = [
            [
                'nombre' => 'Casa Hospedaje Samary',
                'tipo_servicio' => 'Alojamiento',
                'descripcion' => 'Casa hospedaje familiar que ofrece habitaciones cómodas con vista al lago Titicaca y experiencia de turismo vivencial.',
                'ubicacion' => 'Comunidad Llachón, a 200m del muelle principal',
                'telefono' => '951222333',
                'email' => 'samary.llachon@gmail.com',
                'pagina_web' => 'https://samaryllachon.com',
                'horario_atencion' => 'Todos los días: 7:00 am - 10:00 pm',
                'precio_rango' => 'S/. 50 - S/. 100',
                'metodos_pago' => json_encode(['Efectivo', 'Transferencia', 'Yape']),
                'capacidad_aforo' => 12,
                'numero_personas_atiende' => 3,
                'comentarios_resenas' => 'Excelente servicio, habitaciones limpias y comida deliciosa. Muy recomendado.',
                'imagenes' => json_encode(['samary1.jpg', 'samary2.jpg', 'samary3.jpg']),
                'categoria' => 'Alojamiento',
                'certificaciones' => 'TRC MINCETUR',
                'idiomas_hablados' => 'Español, Inglés básico, Quechua',
                'opciones_acceso' => 'A pie, en bote',
                'facilidades_discapacidad' => true,
                'asociacion_id' => 1,
                'estado' => true
            ],
            [
                'nombre' => 'Restaurante Sumaq Mijuna',
                'tipo_servicio' => 'Alimentación',
                'descripcion' => 'Restaurante que ofrece platos típicos de la región elaborados con productos locales y orgánicos.',
                'ubicacion' => 'Plaza principal de Capachica',
                'telefono' => '954333222',
                'email' => 'sumaqmijuna@gmail.com',
                'pagina_web' => null,
                'horario_atencion' => 'Lunes a Domingo: 8:00 am - 8:00 pm',
                'precio_rango' => 'S/. 15 - S/. 35',
                'metodos_pago' => json_encode(['Efectivo', 'Yape']),
                'capacidad_aforo' => 30,
                'numero_personas_atiende' => 5,
                'comentarios_resenas' => 'La trucha frita es espectacular. Ambiente familiar y precios accesibles.',
                'imagenes' => json_encode(['sumaq1.jpg', 'sumaq2.jpg']),
                'categoria' => 'Alimentación',
                'certificaciones' => 'Restaurante Saludable Municipal',
                'idiomas_hablados' => 'Español, Quechua',
                'opciones_acceso' => 'A pie, transporte público, taxi',
                'facilidades_discapacidad' => false,
                'asociacion_id' => null,
                'estado' => true
            ],
            [
                'nombre' => 'Artesanías Titicaca',
                'tipo_servicio' => 'Artesanía',
                'descripcion' => 'Taller y tienda de artesanía textil que utiliza técnicas ancestrales y tintes naturales.',
                'ubicacion' => 'Comunidad Escallani, a 500m de la plaza',
                'telefono' => '957888999',
                'email' => 'artesanias.titicaca@gmail.com',
                'pagina_web' => null,
                'horario_atencion' => 'Lunes a Sábado: 9:00 am - 6:00 pm',
                'precio_rango' => 'S/. 10 - S/. 200',
                'metodos_pago' => json_encode(['Efectivo', 'Transferencia']),
                'capacidad_aforo' => 10,
                'numero_personas_atiende' => 2,
                'comentarios_resenas' => 'Hermosos trabajos textiles. Ofrecen demostraciones del proceso de tejido.',
                'imagenes' => json_encode(['artesania1.jpg', 'artesania2.jpg']),
                'categoria' => 'Artesanía',
                'certificaciones' => 'Marca Perú',
                'idiomas_hablados' => 'Español, Quechua, Aymara',
                'opciones_acceso' => 'A pie',
                'facilidades_discapacidad' => false,
                'asociacion_id' => 2,
                'estado' => true
            ],
            [
                'nombre' => 'Transportes Lacustres Titicaca',
                'tipo_servicio' => 'Transporte',
                'descripcion' => 'Servicio de transporte en bote para visitar las islas y comunidades del lago Titicaca.',
                'ubicacion' => 'Muelle principal de Capachica',
                'telefono' => '956777888',
                'email' => 'lacustrestiticaca@gmail.com',
                'pagina_web' => 'https://transportestiticaca.com',
                'horario_atencion' => 'Todos los días: 6:00 am - 5:00 pm',
                'precio_rango' => 'S/. 30 - S/. 150',
                'metodos_pago' => json_encode(['Efectivo', 'Transferencia', 'Yape', 'Tarjeta']),
                'capacidad_aforo' => 15,
                'numero_personas_atiende' => 2,
                'comentarios_resenas' => 'Botes en buen estado y guías conocedores. Muy seguro y puntual.',
                'imagenes' => json_encode(['transporte1.jpg', 'transporte2.jpg']),
                'categoria' => 'Transporte',
                'certificaciones' => 'MTC, Capitanía de Puertos',
                'idiomas_hablados' => 'Español, Inglés básico',
                'opciones_acceso' => 'A pie',
                'facilidades_discapacidad' => true,
                'asociacion_id' => null,
                'estado' => true
            ],
            [
                'nombre' => 'Aventuras Titicaca',
                'tipo_servicio' => 'Actividades',
                'descripcion' => 'Empresa que ofrece kayak, bicicleta, trekking y otras actividades al aire libre.',
                'ubicacion' => 'Comunidad Cotos, a 1km del centro',
                'telefono' => '959666777',
                'email' => 'aventuras@titicaca.pe',
                'pagina_web' => 'https://aventurastiticaca.pe',
                'horario_atencion' => 'Lunes a Domingo: 7:00 am - 6:00 pm',
                'precio_rango' => 'S/. 40 - S/. 120',
                'metodos_pago' => json_encode(['Efectivo', 'Transferencia', 'Tarjeta']),
                'capacidad_aforo' => 20,
                'numero_personas_atiende' => 4,
                'comentarios_resenas' => 'Increíble experiencia de kayak al amanecer. Equipos en buen estado y guías profesionales.',
                'imagenes' => json_encode(['aventuras1.jpg', 'aventuras2.jpg', 'aventuras3.jpg']),
                'categoria' => 'Actividades',
                'certificaciones' => 'DIRCETUR, Primeros Auxilios',
                'idiomas_hablados' => 'Español, Inglés, Francés básico',
                'opciones_acceso' => 'A pie, transporte público, taxi',
                'facilidades_discapacidad' => false,
                'asociacion_id' => null,
                'estado' => true
            ]
        ];
        
        foreach ($emprendedores as $emprendedor) {
            Emprendedor::create($emprendedor);
        }
    }
    
    private function createServicios()
    {
        $servicios = [
            // Servicios para Casa Hospedaje Samary
            [
                'nombre' => 'Habitación Matrimonial',
                'descripcion' => 'Habitación con cama matrimonial, baño privado y vista al lago.',
                'precio_referencial' => 80.00,
                'emprendedor_id' => 1,
                'categorias' => [1]
            ],
            [
                'nombre' => 'Habitación Familiar',
                'descripcion' => 'Habitación amplia con una cama matrimonial y dos individuales, baño privado.',
                'precio_referencial' => 120.00,
                'emprendedor_id' => 1,
                'categorias' => [1]
            ],
            [
                'nombre' => 'Experiencia cultural',
                'descripcion' => 'Participación en actividades tradicionales como agricultura, pesca y cocina local.',
                'precio_referencial' => 50.00,
                'emprendedor_id' => 1,
                'categorias' => [5]
            ],
            
            // Servicios para Restaurante Sumaq Mijuna
            [
                'nombre' => 'Almuerzo típico',
                'descripcion' => 'Incluye sopa, plato principal (trucha o cordero), postre y mate de hierbas.',
                'precio_referencial' => 25.00,
                'emprendedor_id' => 2,
                'categorias' => [2]
            ],
            [
                'nombre' => 'Cena de pachamanca',
                'descripcion' => 'Tradicional pachamanca preparada con piedras calientes. Mínimo 4 personas.',
                'precio_referencial' => 35.00,
                'emprendedor_id' => 2,
                'categorias' => [2, 5]
            ],
            
            // Servicios para Artesanías Titicaca
            [
                'nombre' => 'Chullo tradicional',
                'descripcion' => 'Gorro tradicional tejido a mano con lana de alpaca y diseños típicos.',
                'precio_referencial' => 45.00,
                'emprendedor_id' => 3,
                'categorias' => [3]
            ],
            [
                'nombre' => 'Taller de tejido',
                'descripcion' => 'Taller de 2 horas donde se enseña técnicas básicas de tejido andino.',
                'precio_referencial' => 30.00,
                'emprendedor_id' => 3,
                'categorias' => [3, 5]
            ],
            
            // Servicios para Transportes Lacustres Titicaca
            [
                'nombre' => 'Tour a Isla Ticonata',
                'descripcion' => 'Viaje en bote a la isla Ticonata con guiado incluido. Duración: 6 horas.',
                'precio_referencial' => 70.00,
                'emprendedor_id' => 4,
                'categorias' => [4, 6]
            ],
            [
                'nombre' => 'Transporte entre comunidades',
                'descripcion' => 'Servicio de transporte acuático entre las comunidades de la península.',
                'precio_referencial' => 30.00,
                'emprendedor_id' => 4,
                'categorias' => [4]
            ],
            
            // Servicios para Aventuras Titicaca
            [
                'nombre' => 'Kayak al amanecer',
                'descripcion' => 'Paseo en kayak para ver el amanecer en el lago Titicaca. Incluye equipamiento y guía.',
                'precio_referencial' => 60.00,
                'emprendedor_id' => 5,
                'categorias' => [5]
            ],
            [
                'nombre' => 'Trekking Mirador Capachica',
                'descripcion' => 'Caminata de 4 horas hasta el mirador con vistas de la península y el lago.',
                'precio_referencial' => 40.00,
                'emprendedor_id' => 5,
                'categorias' => [5, 6]
            ]
        ];
        
        foreach ($servicios as $servicio) {
            $categorias = $servicio['categorias'];
            unset($servicio['categorias']);
            
            $nuevoServicio = Servicio::create($servicio);
            
            // Asociar categorías
            $nuevoServicio->categorias()->attach($categorias);
        }
    }
}