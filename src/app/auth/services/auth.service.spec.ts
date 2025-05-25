import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { WarehouseService } from '../../inventario/services/warehouse.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let warehouseServiceSpy: jasmine.SpyObj<WarehouseService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    warehouseServiceSpy = jasmine.createSpyObj('WarehouseService', ['getWarehouses']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: WarehouseService, useValue: warehouseServiceSpy }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería guardar y recuperar el token', () => {
    service.setToken('fake.token.value');
    expect(localStorage.getItem('auth_token')).toBe('fake.token.value');
    expect(service.getToken()).toBe('fake.token.value');
  });

  it('debería autenticar si hay token', () => {
    service.setToken('fake.token.value');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('debería no autenticar si no hay token', () => {
    localStorage.removeItem('auth_token');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('debería eliminar el token y navegar al logout', () => {
    service.setToken('fake.token.value');
    service.logout();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('debería hacer login y devolver el token', () => {
    const mockResponse = { token: 'jwt.token.value' };
    service.login('user', 'pass').subscribe(res => {
      expect(res.token).toBe('jwt.token.value');
    });
    const req = httpMock.expectOne(req =>
      req.method === 'POST' && req.url.includes('/auth/login')
    );
    expect(req.request.body).toEqual({ username: 'user', password: 'pass' });
    req.flush(mockResponse);
  });

  it('debería devolver permisos vacíos si no hay token', () => {
    localStorage.removeItem('auth_token');
    expect(service.getPermisos()).toEqual([]);
  });

  it('debería devolver username vacío si no hay token', () => {
    localStorage.removeItem('auth_token');
    expect(service.getUsername()).toBe('');
  });

  // Puedes añadir más tests para los métodos de permisos si lo necesitas
});