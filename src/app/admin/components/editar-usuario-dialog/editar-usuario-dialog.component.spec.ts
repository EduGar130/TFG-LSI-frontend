import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarUsuarioDialogComponent } from './editar-usuario-dialog.component';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { WarehouseService } from '../../../inventario/services/warehouse.service';
import { RoleService } from '../../services/role.service';
import { of } from 'rxjs';

describe('EditarUsuarioDialogComponent', () => {
  let component: EditarUsuarioDialogComponent;
  let fixture: ComponentFixture<EditarUsuarioDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<DynamicDialogRef>;
  let configMock: DynamicDialogConfig;
  let warehouseServiceSpy: jasmine.SpyObj<WarehouseService>;
  let roleServiceSpy: jasmine.SpyObj<RoleService>;

  const mockRole = { id: 1, name: 'admin', permissions: '', isGlobal: true };
  const mockUser = { id: 1, username: 'test', email: 'test@mail.com', passwordHash: '', warehouse: null, role: mockRole };
  const mockRoles = [mockRole];
  const mockWarehouses = [{ id: 1, name: 'A', location: 'loc' }];

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('DynamicDialogRef', ['close']);
    configMock = { data: mockUser } as DynamicDialogConfig;
    warehouseServiceSpy = jasmine.createSpyObj('WarehouseService', ['getWarehouses']);
    roleServiceSpy = jasmine.createSpyObj('RoleService', ['getRoles']);

    warehouseServiceSpy.getWarehouses.and.returnValue(of(mockWarehouses));
    roleServiceSpy.getRoles.and.returnValue(of(mockRoles));

    await TestBed.configureTestingModule({
      imports: [EditarUsuarioDialogComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: dialogRefSpy },
        { provide: DynamicDialogConfig, useValue: configMock },
        { provide: WarehouseService, useValue: warehouseServiceSpy },
        { provide: RoleService, useValue: roleServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarUsuarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar roles y almacenes en ngOnInit', () => {
    component.ngOnInit();
    expect(roleServiceSpy.getRoles).toHaveBeenCalled();
    expect(warehouseServiceSpy.getWarehouses).toHaveBeenCalled();
    expect(component.roles.length).toBe(1);
    expect(component.almacenes.length).toBe(1);
    expect(component.esGlobal).toBeTrue();
  });

  it('debería cerrar el diálogo y devolver el usuario al guardar', () => {
    component.guardar();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(component.usuario);
  });

  it('debería cerrar el diálogo sin datos al cancelar', () => {
    component.cancelar();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });

  it('debería actualizar esGlobal y limpiar almacén al seleccionar rol global', () => {
    const event = { value: { isGlobal: true } };
    component.usuario.warehouse = { id: 1, name: 'A', location: 'loc' };
    component.onRolSeleccionado(event);
    expect(component.esGlobal).toBeTrue();
    expect(component.usuario.warehouse).toBeNull();
  });

  it('debería actualizar esGlobal a false al seleccionar rol no global', () => {
    const event = { value: { isGlobal: false } };
    component.onRolSeleccionado(event);
    expect(component.esGlobal).toBeFalse();
  });
});