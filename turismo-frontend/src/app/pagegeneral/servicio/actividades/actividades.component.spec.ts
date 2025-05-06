import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActividadesComponent } from './actividades.component';
import { ServiciosService } from '../servicios/servicios.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

describe('ActividadesComponent', () => {
  let component: ActividadesComponent;
  let fixture: ComponentFixture<ActividadesComponent>;
  let mockServiciosService: jasmine.SpyObj<ServiciosService>;

  const mockServicios = {
    data: {
      data: [
        {
          id: 1,
          nombre: 'Caminata por los Andes',
          categorias: [{ id: 5, nombre: 'Actividades' }],
          emprendedor: { imagenes: JSON.stringify(['imagen1.jpg', 'imagen2.jpg']) }
        },
        {
          id: 2,
          nombre: 'Hospedaje Rural',
          categorias: [{ id: 1, nombre: 'Alojamiento' }],
          emprendedor: { imagenes: JSON.stringify(['hospedaje.jpg']) }
        },
        {
          id: 3,
          nombre: 'Kayak en el lago',
          categorias: [{ id: 5, nombre: 'Actividades' }],
          emprendedor: { imagenes: 'malformato' } // prueba de error en JSON.parse
        }
      ]
    }
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ServiciosService', ['obtenerServicios']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      declarations: [ActividadesComponent],
      providers: [{ provide: ServiciosService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ActividadesComponent);
    component = fixture.componentInstance;
    mockServiciosService = TestBed.inject(ServiciosService) as jasmine.SpyObj<ServiciosService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería filtrar actividades con categoría id=5 y asignar imagenPrincipal', () => {
    mockServiciosService.obtenerServicios.and.returnValue(of(mockServicios));

    component.ngOnInit();

    expect(component.actividades.length).toBe(2);

    // Primer servicio: imagen correctamente parseada
    expect(component.actividades[0].nombre).toBe('Caminata por los Andes');
    expect(component.actividades[0].imagenPrincipal).toBe('imagen1.jpg');

    // Segundo servicio: imagen malformada → default
    expect(component.actividades[1].nombre).toBe('Kayak en el lago');
    expect(component.actividades[1].imagenPrincipal).toBe('default.jpg');
  });
});
