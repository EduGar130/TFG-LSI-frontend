import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReponedorGuard } from './reponedor.guard';
import { AuthService } from '../services/auth.service';

describe('ReponedorGuard', () => {
  let guard: ReponedorGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isReponedor', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        ReponedorGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(ReponedorGuard);
  });

  it('debería permitir el acceso si el usuario es reponedor', () => {
    authServiceSpy.isReponedor.and.returnValue(true);
    const result = guard.canActivate();
    expect(result).toBeTrue();
    expect(authServiceSpy.logout).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería denegar el acceso y redirigir si el usuario NO es reponedor', () => {
    authServiceSpy.isReponedor.and.returnValue(false);
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});