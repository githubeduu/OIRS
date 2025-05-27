import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexComponent } from './index.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { UserService } from '../../services/usuario-service/usuario.service';
import { of, throwError } from 'rxjs';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  // Mock para UserService
  const mockUserService = {
    getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ id: 1, name: 'Test User' }),
    logout: jasmine.createSpy('logout'),
  };

  const mockLibroService = {
    getAllBook: jasmine.createSpy('getAllBook').and.returnValue(
      of([
        { id: 99, titulo: 'Libro 1' },
        { id: 100, titulo: 'Libro 2' },
        { id: 101, titulo: 'Libro 3' },
      ])
    ),
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar currentUser en ngOnInit', () => {
    component.ngOnInit();
    expect(mockUserService.getCurrentUser).toHaveBeenCalled();
    expect(component.currentUser).toEqual({ id: 1, name: 'Test User' });
  });

  it('debería llamar a logout y restablecer currentUser', () => {
    component.logout();
    expect(mockUserService.logout).toHaveBeenCalled();
    expect(component.currentUser).toBeNull();
  });

  it('debería inicializar el carrusel con la primera diapositiva activa', () => {
    const mockSlides = [
      { classList: { add: jasmine.createSpy('add'), remove: jasmine.createSpy('remove') } },
      { classList: { add: jasmine.createSpy('add'), remove: jasmine.createSpy('remove') } },
    ];

    spyOn(component['el'].nativeElement, 'querySelectorAll').and.returnValue(mockSlides);

    component.ngAfterViewInit();

    expect(mockSlides[0].classList.add).toHaveBeenCalledWith('active');
  });


  it('debería obtener y filtrar los productos con id >= 100 en ngOnInit', () => {
    component.ngOnInit();

    expect(mockLibroService.getAllBook).toHaveBeenCalled();
    expect(component.products).toEqual([
      { id: 100, titulo: 'Libro 2' },
      { id: 101, titulo: 'Libro 3' },
    ]);
  });
});
