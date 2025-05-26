import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PERMISO_CREATE_USERS, PERMISO_MANAGE_TRANSACTIONS, PERMISO_VIEW_ALERTS, PERMISO_VIEW_STATS } from '../../../common/constants';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['getCurrentTheme', 'toggleTheme']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated$', 'getPermisos', 'hasPermiso', 'logout'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    themeServiceSpy.getCurrentTheme.and.returnValue('light');
    authServiceSpy.isAuthenticated$ = of(true); 
    authServiceSpy.hasPermiso.and.callFake((permiso: string) => true);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería construir el menú con todos los permisos', () => {
    component.buildMenu();
    // Espera que existan los ítems principales
    const tooltips = component.items.map(i => i.tooltip);
    expect(tooltips).toContain('Estadísticas');
    expect(tooltips).toContain('Inventario');
    expect(tooltips).toContain('Notificaciones');
    expect(tooltips).toContain('Movimientos');
    expect(tooltips).toContain('Administración de usuarios');
    expect(tooltips).toContain('Cambiar tema');
    expect(tooltips).toContain('Cerrar sesión');
    expect(tooltips).toContain('Inicio');
  });

  it('debería cambiar el tema al llamar toggleTheme', () => {
    themeServiceSpy.getCurrentTheme.and.returnValue('dark');
    component.toggleTheme();
    expect(themeServiceSpy.toggleTheme).toHaveBeenCalled();
    expect(component.currentTheme).toBe('dark');
  });

  it('debería llamar logout y navegar al login', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('debería navegar a admin', () => {
    component.navigateAdmin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('debería navegar a estadísticas', () => {
    component.navigateStats();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/stats']);
  });

  it('debería navegar a inventario', () => {
    component.navigateInventario();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/inventario']);
  });

  it('debería navegar a notificaciones', () => {
    component.navigateNotificaciones();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/notificaciones']);
  });
});