import { Injectable } from '@angular/core';

// Define una interfaz más completa para Evento si necesitas más detalles
export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagen: string;
  lugar?: string;
  organizador?: string;
  detallesAdicionales?: string; // Campo para más información
}

@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})

export class EventosService {
  private eventos: Evento[] = [
    {
      id: 1,
      titulo: '¡Celebra el Día de la Madre!',
      descripcion: 'Rinde homenaje a las mujeres que nos dieron la vida con actividades especiales, música, reconocimientos y mucha emoción.',
      fecha: '11/05/2024', // Mantén tus fechas actualizadas
      imagen: 'https://elcomercio.pe/resizer/v2/R7XFQBIEOJHCVNSHRY4PW65CFM.jpg?auth=315e63ed3c51c5074fd1f1e0702236259ba7c70b24225684a2d957c8d645c882&width=1200&height=810&quality=90&smart=true',
      lugar: 'Parque Central de la Ciudad',
      organizador: 'Comité Festivo Municipal',
      detallesAdicionales: 'Habrá música en vivo, sorteos y un pequeño refrigerio para las mamás asistentes. Cupos limitados, ¡regístrate pronto!'
    },
    {
      id: 2,
      titulo: '¡Día de la Bandera!',
      descripcion: 'Jornada cívica con desfiles escolares, actos protocolares y renovación del juramento a la bandera, fomentando el amor por la patria.',
      fecha: '10/07/2025', // Ejemplo de fecha futura
      imagen: 'https://www.peru.travel/Contenido/Uploads/dia-bandera-peru_637616931537281725.jpg',
      lugar: 'Cerro Mirador "El Cóndor"',
      organizador: 'Club de Montañismo Andino',
      detallesAdicionales: 'Requiere inscripción previa. Incluye guía especializado y equipo básico de seguridad. Nivel de dificultad: moderado.'
    },
        {
      id: 3,
      titulo: '¡Celebra el Día del Padre!',
      descripcion: 'Una jornada dedicada a todos los padres de Capachica, con concursos, presentaciones artísticas y sorpresas preparadas con mucho cariño.',
      fecha: '15/06/2025', // Ejemplo de fecha futura
      imagen: 'https://www.sancristobalsl.com/archivos/blog/2805/20190313105451.celebrando_el_dia_del_padre_ideas_para_regalar_colegio_san_cristobal_castellon-1370.jpg',
      lugar: 'Plaza de la Cultura',
      organizador: 'Asociación Cultural Sol Naciente',
      detallesAdicionales: 'Ingreso libre. Talleres participativos de artesanía y gastronomía típica durante todo el día.'
    },
    {
      id: 4,
      titulo: '¡Fiambrada!',
      descripcion: 'Tradición popular que reúne a familias en espacios naturales para compartir fiambres (platos fríos típicos), acompañado de música, baile y encuentro comunitario.',
      fecha: '07/08/2025', // Ejemplo de fecha futura
      imagen: 'https://ladecana.pe/wp-content/uploads/2021/08/Municipalidad-de-Puno-participa-de-caminata-por-el-Qhapaq-Nan-1-1024x768.jpeg',
      lugar: 'Campo Ferial de la Ciudad',
      organizador: 'Asociación de Restauradores Unidos',
      detallesAdicionales: 'Más de 50 stands de comida, postres y bebidas. Shows de cocina en vivo y concursos.'
    },
    // Agrega más eventos aquí según necesites
    {
      id: 5,
      titulo: '¡Festividad Patronal del Niño San Salvador de Capachica!',
      descripcion: 'Acompáñanos en nuestra festividad más representativa, donde la fe y la tradición se unen con danzas, procesiones y expresiones culturales únicas que llenan de orgullo a nuestro pueblo.',
      fecha: '07/08/2025', // Ejemplo de fecha futura
      imagen: 'https://diariocorreo.pe/resizer/Run_2VxLinZd4NYAnnsyitxIcgk=/980x0/smart/filters:format(jpeg):quality(75)/arc-anglerfish-arc2-prod-elcomercio.s3.amazonaws.com/public/4BUL7NBYAFDTBIKTHFMM4H27HU.jpg',
      lugar: 'Campo Ferial de la Ciudad',
      organizador: 'Asociación de Restauradores Unidos',
      detallesAdicionales: 'Más de 50 stands de comida, postres y bebidas. Shows de cocina en vivo y concursos.'
    },
    {
      id: 6,
      titulo: 'Festividad Patronal del Niño San Salvador de Capachica',
      descripcion: 'Acompáñanos en nuestra festividad más representativa, donde la fe y la tradición se unen con danzas, procesiones y expresiones culturales únicas que llenan de orgullo a nuestro pueblo.',
      fecha: '07/08/2025', // Ejemplo de fecha futura
      imagen: 'https://diariocorreo.pe/resizer/Run_2VxLinZd4NYAnnsyitxIcgk=/980x0/smart/filters:format(jpeg):quality(75)/arc-anglerfish-arc2-prod-elcomercio.s3.amazonaws.com/public/4BUL7NBYAFDTBIKTHFMM4H27HU.jpg',
      lugar: 'Campo Ferial de la Ciudad',
      organizador: 'Asociación de Restauradores Unidos',
      detallesAdicionales: 'Más de 50 stands de comida, postres y bebidas. Shows de cocina en vivo y concursos.'
    }
  ];

  constructor() { }

  getEventos(): Evento[] {
    return this.eventos;
  }

  getEventoById(id: number): Evento | undefined {
    return this.eventos.find(evento => evento.id === id);
  }
}
