import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionesLayoutComponent } from './notificaciones-layout.component';
import { AuthService } from '../../../auth/services/auth.service';
import { InventoryService } from '../../../inventario/services/inventario.service';
import { WarehouseService } from '../../../inventario/services/warehouse.service';
import { AlertService } from '../../services/alerts.service';
import { of } from 'rxjs';

describe('NotificacionesLayoutComponent', () => {
  let component: NotificacionesLayoutComponent;
  let fixture: ComponentFixture<NotificacionesLayoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let inventoryServiceSpy: jasmine.SpyObj<InventoryService>;
  let warehouseServiceSpy: jasmine.SpyObj<WarehouseService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  const mockWarehouse = { id: 1, name: 'A', location: 'loc' };
  const mockCategory = { id: 1, name: 'Cat', description: 'desc' };
  const mockProduct = { id: 1, name: 'P', description: '', price: 1, stockAlertThreshold: 1, sku: '', category: mockCategory };
  const mockInventory = [{ id: 1, product: mockProduct, warehouse: mockWarehouse, quantity: 10 }];
  const mockAlerts = [{ id: 1, product: mockProduct, warehouse: mockWarehouse, alertType: 'stock', message: 'Alerta', createdAt: new Date() }];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['hasPermiso', 'getLocation']);
    inventoryServiceSpy = jasmine.createSpyObj('InventoryService', ['getInventory', 'getInventoryByWarehouse']);
    warehouseServiceSpy = jasmine.createSpyObj('WarehouseService', ['getWarehouses']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['getAlerts']);

    await TestBed.configureTestingModule({
      imports: [NotificacionesLayoutComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: InventoryService, useValue: inventoryServiceSpy },
        { provide: WarehouseService, useValue: warehouseServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacionesLayoutComponent);
    component = fixture.componentInstance;
  });

  it('debería cargar productos y alertas como admin', async () => {
    authServiceSpy.hasPermiso.and.returnValue(true);
    inventoryServiceSpy.getInventory.and.returnValue(of(mockInventory));
    alertServiceSpy.getAlerts.and.returnValue(of(mockAlerts));

    await component.ngOnInit();

    expect(component.isAdmin).toBeTrue();
    expect(component.productos).toEqual(mockInventory);
    expect(component.alertas).toEqual(mockAlerts);
    expect(component.datosCargados).toBeTrue();
    expect(inventoryServiceSpy.getInventory).toHaveBeenCalled();
    expect(alertServiceSpy.getAlerts).toHaveBeenCalled();
  });

  it('debería cargar productos y alertas como usuario normal', async () => {
    authServiceSpy.hasPermiso.and.returnValue(false);
    authServiceSpy.getLocation.and.returnValue(Promise.resolve(mockWarehouse));
    inventoryServiceSpy.getInventoryByWarehouse.and.returnValue(of(mockInventory));
    alertServiceSpy.getAlerts.and.returnValue(of(mockAlerts));

    await component.ngOnInit();

    expect(component.isAdmin).toBeFalse();
    expect(component.productos).toEqual(mockInventory);
    expect(component.alertas).toEqual(mockAlerts);
    expect(component.datosCargados).toBeTrue();
    expect(authServiceSpy.getLocation).toHaveBeenCalled();
    expect(inventoryServiceSpy.getInventoryByWarehouse).toHaveBeenCalledWith(mockWarehouse.id);
    expect(alertServiceSpy.getAlerts).toHaveBeenCalled();
  });

  it('getUnits debería devolver la cantidad correcta', () => {
    component.productos = mockInventory;
    const units = component.getUnits(mockAlerts[0]);
    expect(units).toBe(10);
  });

  it('getUnits debería devolver -1 si no encuentra el producto', () => {
    component.productos = [];
    const units = component.getUnits(mockAlerts[0]);
    expect(units).toBe(-1);
  });
});