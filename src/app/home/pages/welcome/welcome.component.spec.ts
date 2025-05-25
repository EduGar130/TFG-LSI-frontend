import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PERMISO_FULL_ACCESS, PERMISO_MANAGE_INVENTORY, PERMISO_VIEW_REPORTS, PERMISO_VIEW_STATS } from '../../../common/constants';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUsername', 'hasPermiso', 'getLocation'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authServiceSpy.getUsername.and.returnValue('usuario');
    authServiceSpy.getLocation.and.returnValue(Promise.resolve({ id: 1, name: 'A', location: 'loc' }));

    await TestBed.configureTestingModule({
      imports: [WelcomeComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el username al inicializar', () => {
    expect(authServiceSpy.getUsername).toHaveBeenCalled();
    expect(component.username).toBe('usuario');
  });

  it('debería establecer esAdmin y esReponedor si tiene PERMISO_FULL_ACCESS', () => {
    authServiceSpy.hasPermiso.and.callFake((permiso: string) => permiso === PERMISO_FULL_ACCESS);
    component.ngOnInit();
    expect(component.esAdmin).toBeTrue();
    expect(component.esReponedor).toBeTrue();
    expect(component.esMarketing).toBeFalse();
  });

  it('debería establecer esMarketing si tiene PERMISO_VIEW_STATS', () => {
    authServiceSpy.hasPermiso.and.callFake((permiso: string) => permiso === PERMISO_VIEW_STATS);
    component.ngOnInit();
    expect(component.esMarketing).toBeTrue();
    expect(component.esAdmin).toBeFalse();
    expect(component.esReponedor).toBeFalse();
  });

  it('debería establecer esMarketing si tiene PERMISO_VIEW_REPORTS', () => {
    authServiceSpy.hasPermiso.and.callFake((permiso: string) => permiso === PERMISO_VIEW_REPORTS);
    component.ngOnInit();
    expect(component.esMarketing).toBeTrue();
    expect(component.esAdmin).toBeFalse();
    expect(component.esReponedor).toBeFalse();
  });

  it('debería establecer esReponedor y llamar a loadLocation si tiene PERMISO_MANAGE_INVENTORY', async () => {
    authServiceSpy.hasPermiso.and.callFake((permiso: string) => permiso === PERMISO_MANAGE_INVENTORY);
    const loadLocationSpy = spyOn<any>(component, 'loadLocation').and.callThrough();
    await component.ngOnInit();
    expect(component.esReponedor).toBeTrue();
    expect(loadLocationSpy).toHaveBeenCalled();
  });

  it('debería llamar a loadLocation si no tiene permisos especiales', async () => {
    authServiceSpy.hasPermiso.and.returnValue(false);
    const loadLocationSpy = spyOn<any>(component, 'loadLocation').and.callThrough();
    await component.ngOnInit();
    expect(loadLocationSpy).toHaveBeenCalled();
  });

  it('debería actualizar la hora actual', () => {
    component.updateTime();
    expect(component.currentTime).toMatch(/\d{1,2}:\d{2}:\d{2}/);
  });

  it('navigateInventory debería navegar a /inventario', () => {
    component.navigateInventory();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/inventario']);
  });

  it('navigateStats debería navegar a /stats', () => {
    component.navigateStats();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/stats']);
  });
});