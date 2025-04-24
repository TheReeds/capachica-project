import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Negocio {
  id: number;
  nombre: string;
  categoria: string;
  direccion: string;
  calificacion: number;
  horario: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-pageemprendedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './pageemprendedores.component.html',
  styleUrls: ['./pageemprendedores.component.css']
})
export class PageemprendedoresComponent implements OnInit {
  
  // Variables para filtrado y visualización
  activeFilter: string = 'todos';
  searchQuery: string = '';
  showMap: boolean = false;
  sortOrder: string = 'relevance';
  
  // Lista de negocios
  empresas: Negocio[] = [
    { 
      id: 1, 
      nombre: 'Café Del Sol', 
      categoria: 'restaurante', 
      direccion: 'Calle Principal 123', 
      calificacion: 4.5, 
      horario: '8:00 - 22:00', 
      descripcion: 'Cafetería acogedora con platos caseros y especialidades de café.',
      imagen: '/assets/images/placeholder-600x400.jpg'
    },
    { 
      id: 2, 
      nombre: 'Farmacia Moderna', 
      categoria: 'salud', 
      direccion: 'Av. Libertad 45', 
      calificacion: 4.2, 
      horario: '24 horas', 
      descripcion: 'Farmacia completa con servicios de atención rápida y envíos a domicilio.',
      imagen: '/assets/images/placeholder-600x400.jpg'
    },
    { 
      id: 3, 
      nombre: 'Tech Solutions', 
      categoria: 'tecnologia', 
      direccion: 'Plaza Central 78', 
      calificacion: 4.7, 
      horario: '9:00 - 20:00', 
      descripcion: 'Venta y reparación de equipos de computación y móviles.',
      imagen: '/assets/images/placeholder-600x400.jpg'
    },
    { 
      id: 4, 
      nombre: 'La Bodega', 
      categoria: 'tienda', 
      direccion: 'Calle Secundaria 56', 
      calificacion: 3.9, 
      horario: '7:00 - 23:00', 
      descripcion: 'Supermercado de barrio con productos frescos y precios económicos.',
      imagen: '/assets/images/placeholder-600x400.jpg'
    },
    { 
      id: 5, 
      nombre: 'El Jardín', 
      categoria: 'restaurante', 
      direccion: 'Paseo Flores 22', 
      calificacion: 4.8, 
      horario: '12:00 - 00:00', 
      descripcion: 'Restaurante con terraza y especialidades en carnes y mariscos.',
      imagen: '/assets/images/placeholder-600x400.jpg'
    },
    { 
      id: 6, 
      nombre: 'Centro Fitness', 
      categoria: 'deporte', 
      direccion: 'Av. Deportiva 100', 
      calificacion: 4.3, 
      horario: '6:00 - 22:00', 
      descripcion: 'Gimnasio completo con clases grupales y entrenadores personales.',
      imagen: '/assets/images/placeholder-600x400.jpg'
    }
  ];
  
  constructor() {}
  
  ngOnInit(): void {
    // Inicialización del componente
  }
  
  // Método para filtrar los negocios según los criterios seleccionados
  get filteredBusinesses(): Negocio[] {
    return this.empresas.filter(negocio => {
      const matchesFilter = this.activeFilter === 'todos' || negocio.categoria === this.activeFilter;
      const matchesSearch = negocio.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                          negocio.descripcion.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    }).sort((a, b) => {
      if (this.sortOrder === 'rating') {
        return b.calificacion - a.calificacion;
      }
      return 0;
    });
  }
  
  // Métodos para el manejo de filtros
  setFilter(filter: string): void {
    this.activeFilter = filter;
  }
  
  // Método para cambiar la vista (mapa/lista)
  toggleMapView(show: boolean): void {
    this.showMap = show;
  }
  
  // Método para el manejo del cambio en el orden
  changeSortOrder(event: Event): void {
    this.sortOrder = (event.target as HTMLSelectElement).value;
  }
  
  // Método para manejar la búsqueda
  onSearchChange(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }
  
  // Método para obtener la clase CSS según la categoría
  getCategoryClass(categoria: string): string {
    switch(categoria) {
      case 'restaurante':
        return 'bg-green-100 text-green-800';
      case 'salud':
        return 'bg-blue-100 text-blue-800';
      case 'tecnologia':
        return 'bg-purple-100 text-purple-800';
      case 'tienda':
        return 'bg-amber-100 text-amber-800';
      case 'deporte':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}