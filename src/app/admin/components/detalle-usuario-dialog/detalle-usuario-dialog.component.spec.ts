import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleUsuarioDialogComponent } from './detalle-usuario-dialog.component';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

describe('DetalleUsuarioDialogComponent', () => {
  let component: DetalleUsuarioDialogComponent;
  let fixture: ComponentFixture<DetalleUsuarioDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<DynamicDialogRef>;
  let configMock: DynamicDialogConfig;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('DynamicDialogRef', ['close']);
    configMock = { data: { name: 'Test User', username: 'testuser', email: 'test@mail.com' } } as DynamicDialogConfig;
    await TestBed.configureTestingModule({
      imports: [DetalleUsuarioDialogComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: dialogRefSpy },
        { provide: DynamicDialogConfig, useValue: configMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleUsuarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería inicializar el usuario desde config', () => {
    expect(component.usuario).toEqual(configMock.data);
  });

  it('debería cerrar el diálogo al llamar cerrar()', () => {
    component.cerrar();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});