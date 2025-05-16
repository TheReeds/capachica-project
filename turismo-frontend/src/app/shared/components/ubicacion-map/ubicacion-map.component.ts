import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ubicacion-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-80 rounded-lg overflow-hidden border border-gray-300 shadow-inner">
      <div id="map" class="w-full h-full"></div>
    </div>
    <p class="mt-2 text-sm text-gray-500">
      Haga clic en el mapa para seleccionar la ubicación exacta del servicio.
    </p>
  `,
  styles: [`
    ::ng-deep .leaflet-container {
      height: 100%;
      width: 100%;
    }
  `]
})
export class UbicacionMapComponent implements OnInit, OnChanges {
  @Input() latitud?: number | null;
  @Input() longitud?: number | null;
  @Input() readOnly: boolean = false; 
  @Output() ubicacionChange = new EventEmitter<{lat: number, lng: number}>();
  
  private map: any;
  private marker: any;
  private Leaflet: any;
  
  constructor() {}
  
  ngOnInit() {
    this.loadLeaflet().then(() => {
      this.initMap();
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if ((changes['latitud'] || changes['longitud']) && this.map && this.Leaflet) {
      this.updateMarkerPosition();
    }
  }
  
  private loadLeaflet(): Promise<void> {
    return new Promise<void>((resolve) => {
      // Si Leaflet ya está cargado, resolver inmediatamente
      if (window.L) {
        this.Leaflet = window.L;
        resolve();
        return;
      }
      
      // Cargar CSS de Leaflet
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
      
      // Cargar JavaScript de Leaflet
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        this.Leaflet = window.L;
        resolve();
      };
      document.head.appendChild(script);
    });
  }
  
  private initMap() {
    // Valor predeterminado: Lago Titicaca, Perú
    const defaultLat = -15.8402;
    const defaultLng = -69.3370;
    
    // Crear el mapa
    this.map = this.Leaflet.map('map').setView(
      [this.latitud || defaultLat, this.longitud || defaultLng], 
      13
    );
    
    // Añadir capa de mapa base (OpenStreetMap)
    this.Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    
    // Inicializar el marcador si hay coordenadas
    this.updateMarkerPosition();
    
    // Añadir evento de clic en el mapa
    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      this.ubicacionChange.emit({ lat, lng });
      
      // Actualizar el marcador
      if (!this.marker) {
        this.marker = this.Leaflet.marker([lat, lng]).addTo(this.map);
      } else {
        this.marker.setLatLng([lat, lng]);
      }
    });
  }
  
  private updateMarkerPosition() {
    if (!this.map || !this.Leaflet) return;
    
    // Si no hay coordenadas, no hacer nada
    if (!this.latitud || !this.longitud) {
      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = null;
      }
      return;
    }
    
    // Centrar el mapa en las coordenadas
    this.map.setView([this.latitud, this.longitud], 13);
    
    // Actualizar o crear el marcador
    if (!this.marker) {
      this.marker = this.Leaflet.marker([this.latitud, this.longitud]).addTo(this.map);
    } else {
      this.marker.setLatLng([this.latitud, this.longitud]);
    }
  }
}

// Declarar la interfaz de la ventana para tener acceso a Leaflet
declare global {
  interface Window {
    L: any;
  }
}