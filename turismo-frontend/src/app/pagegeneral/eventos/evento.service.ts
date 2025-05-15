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
      descripcion: 'Este evento especial está diseñado para celebrar a todas las mamás. Disfruta de actividades y sorpresas en un ambiente lleno de cariño y amor.',
      fecha: '14/05/2024', // Mantén tus fechas actualizadas
      imagen: 'https://marketplace.canva.com/EAFwiYPsxqI/1/0/1600w/canva-tarjeta-feliz-d%C3%ADa-de-la-madre-delicado-floral-beige-46hQdKcgZ6c.jpg',
      lugar: 'Parque Central de la Ciudad',
      organizador: 'Comité Festivo Municipal',
      detallesAdicionales: 'Habrá música en vivo, sorteos y un pequeño refrigerio para las mamás asistentes. Cupos limitados, ¡regístrate pronto!'
    },
    {
      id: 2,
      titulo: 'Festival Cultural "Raíces Vivas"',
      descripcion: 'Un encuentro con las tradiciones ancestrales, música, danza y arte de nuestra región.',
      fecha: '20/07/2025', // Ejemplo de fecha futura
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi1uTTR0Irw12-e0NN9BJGtUv4HPT0TKNELQ&s',
      lugar: 'Plaza de la Cultura',
      organizador: 'Asociación Cultural Sol Naciente',
      detallesAdicionales: 'Ingreso libre. Talleres participativos de artesanía y gastronomía típica durante todo el día.'
    },
    {
      id: 3,
      titulo: 'Aventura Nocturna: Caminata bajo las Estrellas',
      descripcion: 'Una experiencia mágica de senderismo nocturno, observando el cielo y descubriendo la naturaleza de noche.',
      fecha: '15/08/2025', // Ejemplo de fecha futura
      imagen: 'https://titicacatravelperu.com/wp-content/uploads/2016/06/llachon-full-day-4.jpg',
      lugar: 'Cerro Mirador "El Cóndor"',
      organizador: 'Club de Montañismo Andino',
      detallesAdicionales: 'Requiere inscripción previa. Incluye guía especializado y equipo básico de seguridad. Nivel de dificultad: moderado.'
    },
    {
      id: 4,
      titulo: 'Gran Feria Gastronómica Regional',
      descripcion: 'Disfruta de la mejor gastronomía local de la región, con platos innovadores y tradicionales que deleitarán tu paladar.',
      fecha: '10/09/2025', // Ejemplo de fecha futura
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJjTLeUPcxkk64eT21OnjsBy__fFofUO_xroxdiXxiSynRmuLnI7Nw8zKY6bqBCWRI_88&usqp=CAU',
      lugar: 'Campo Ferial de la Ciudad',
      organizador: 'Asociación de Restauradores Unidos',
      detallesAdicionales: 'Más de 50 stands de comida, postres y bebidas. Shows de cocina en vivo y concursos.'
    }
    // Agrega más eventos aquí según necesites
  ];

  constructor() { }

  getEventos(): Evento[] {
    return this.eventos;
  }

  getEventoById(id: number): Evento | undefined {
    return this.eventos.find(evento => evento.id === id);
  }
}
