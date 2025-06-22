import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoSolicitudesComponent } from './listado-solicitudes.component';

describe('ListadoSolicitudesComponent', () => {
  let component: ListadoSolicitudesComponent;
  let fixture: ComponentFixture<ListadoSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoSolicitudesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener 3 solicitudes precargadas', () => {
    expect(component.solicitudes.length).toBe(3);
  });
});
