import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'login', 'setToken']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a logout al inicializar', () => {
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('debería hacer login exitoso y navegar a /home', () => {
    component.username = 'usuario';
    component.password = 'clave';
    const fakeResponse = { token: '123' };
    authServiceSpy.login.and.returnValue(of(fakeResponse));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('usuario', 'clave');
    expect(authServiceSpy.setToken).toHaveBeenCalledWith('123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.errorMessage).toBe('');
  });

  it('debería mostrar mensaje de error si el login falla', () => {
    component.username = 'usuario';
    component.password = 'malaclave';
    authServiceSpy.login.and.returnValue(throwError(() => new Error('error')));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('usuario', 'malaclave');
    expect(component.errorMessage).toBe('Usuario o contraseña incorrectos');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería alternar la visibilidad de la contraseña', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });
});