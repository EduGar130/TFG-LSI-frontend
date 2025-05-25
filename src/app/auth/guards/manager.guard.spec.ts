import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ManagerGuard } from './manager.guard';
import { AuthService } from '../services/auth.service';

describe('ManagerGuard', () => {
  let guard: ManagerGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isManager', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        ManagerGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(ManagerGuard);
  });

  it('debería permitir el acceso si el usuario es manager', () => {
    authServiceSpy.isManager.and.returnValue(true);
    const result = guard.canActivate();
    expect(result).toBeTrue();
    expect(authServiceSpy.logout).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería denegar el acceso y redirigir si el usuario NO es manager', () => {
    authServiceSpy.isManager.and.returnValue(false);
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});