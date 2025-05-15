import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiciosComponent } from './servicios.component';
import { ServiciosService } from './servicios.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

describe('ServiciosComponent', () => {
  let component: ServiciosComponent;
  let fixture: ComponentFixture<ServiciosComponent>;
  let mockServiciosService: jasmine.SpyObj<ServiciosService>;

  const serviciosMock = [
    {
      id: 1,
      nombre: 'Tour Lago Titicaca',
      categoria_servicio: { nombre: 'Guiado' },
      categorias: [{ id: 5, nombre: 'Guiado' }]
    },
    {
      id: 2,
      nombre: 'Hospedaje Familiar',
      categoria_servicio: { nombre: 'Alojamiento' },
      categorias: [{ id: 1, nombre: 'Alojamiento' }]
    }
  ];

  const categoriasMock = [
    { id: 1, nombre: 'Alojamiento' },
    { id: 5, nombre: 'Guiado' }
  ];

  const municipalidadMock = {
    id: 1,
    nombre: 'Capachica',
    sliders_principales: { titulo: 'Bienvenidos' }
  };

  beforeEach(async () => {
    const serviciosServiceSpy = jasmine.createSpyObj('ServiciosService', [
      'obtenerServicios',
      'obtenerCategorias',
      'obtenerMunicipalidad'
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      declarations: [ServiciosComponent],
      providers: [{ provide: ServiciosService, useValue: serviciosServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosComponent);
    component = fixture.componentInstance;
    mockServiciosService = TestBed.inject(ServiciosService) as jasmine.SpyObj<ServiciosService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar servicios y agrupar por categoría', () => {
    mockServiciosService.obtenerServicios.and.returnValue(of({ data: serviciosMock }));

    component.cargarServicios();

    expect(component.servicios.length).toBe(2);
    expect(component.serviciosAgrupadosPorCategoria['Guiado'].length).toBe(1);
    expect(component.serviciosAgrupadosPorCategoria['Alojamiento'].length).toBe(1);
  });

  it('debería cargar categorías', () => {
    mockServiciosService.obtenerCategorias.and.returnValue(of({ data: categoriasMock }));

    component.cargarCategorias();

    expect(component.categorias.length).toBe(2);
  });

  it('debería cargar municipalidad y corregir sliders si no es array', () => {
    mockServiciosService.obtenerMunicipalidad.and.returnValue(of(municipalidadMock));

    component.cargarMunicipalidad();

    expect(Array.isArray(component.municipalidad.sliders_principales)).toBeTrue();
    expect(component.municipalidad.sliders_principales.length).toBe(1);
  });

  it('debería filtrar servicios por categoría', () => {
    component.servicios = serviciosMock;
    component.categorias = categoriasMock;

    component.filtrarPorCategoria(1);

    expect(component.serviciosFiltrados.length).toBe(1);
    expect(component.categoriaSeleccionada).toBe('Alojamiento');
  });

  it('debería abrir y cerrar detalle de emprendedor', () => {
    const servicio = serviciosMock[0];

    component.abrirDetalleEmprendedor(servicio);
    expect(component.emprendedorSeleccionado).toBe(servicio);

    component.cerrarDetalleEmprendedor();
    expect(component.emprendedorSeleccionado).toBeNull();
  });
});
