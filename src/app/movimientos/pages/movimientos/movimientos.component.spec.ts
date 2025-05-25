import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimientosComponent } from './movimientos.component';
import { MessageService } from 'primeng/api';
import { InventoryService } from '../../../inventario/services/inventario.service';
import { AuthService } from '../../../auth/services/auth.service';
import { WarehouseService } from '../../../inventario/services/warehouse.service';
import { TransactionService } from '../../services/transaction.service';
import { of } from 'rxjs';
import { TransactionType } from '../../model/transaction.model';
import { fakeAsync, tick } from '@angular/core/testing';

describe('MovimientosComponent', () => {
  let component: MovimientosComponent;
  let fixture: ComponentFixture<MovimientosComponent>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let inventoryServiceSpy: jasmine.SpyObj<InventoryService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let warehouseServiceSpy: jasmine.SpyObj<WarehouseService>;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;

  const mockWarehouse = { id: 1, name: 'A', location: 'loc' };
  const mockCategory = { id: 1, name: 'Cat', description: 'desc' };
  const mockProduct = { id: 1, name: 'Prod', description: '', price: 1, stockAlertThreshold: 1, sku: '', category: mockCategory };
  const mockInventory = [{ id: 1, product: mockProduct, warehouse: mockWarehouse, quantity: 10 }];
  let mockTransaction: any;

  beforeEach(async () => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    inventoryServiceSpy = jasmine.createSpyObj('InventoryService', ['getInventoryByWarehouse']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAdmin', 'isManager', 'getLocation', 'getUsername']);
    warehouseServiceSpy = jasmine.createSpyObj('WarehouseService', ['getWarehouses']);
    transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['getTransactions', 'addTransaction']);

    authServiceSpy.isAdmin.and.returnValue(true);
    authServiceSpy.isManager.and.returnValue(true);
    authServiceSpy.getLocation.and.returnValue(Promise.resolve(mockWarehouse));
    authServiceSpy.getUsername.and.returnValue('user');
    warehouseServiceSpy.getWarehouses.and.returnValue(of([mockWarehouse]));
    inventoryServiceSpy.getInventoryByWarehouse.and.returnValue(of(mockInventory));
    transactionServiceSpy.getTransactions.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [MovimientosComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: InventoryService, useValue: inventoryServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: WarehouseService, useValue: warehouseServiceSpy },
        { provide: TransactionService, useValue: transactionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovimientosComponent);
    component = fixture.componentInstance;
    mockTransaction = { 
      ...component.movimiento, 
      id: 1, 
      product: mockProduct, 
      warehouse: mockWarehouse, 
      user: { id: 1, username: 'user', email: '', role: { id: 1, name: '', permissions: '', isGlobal: false }, warehouse: mockWarehouse }, 
      type: TransactionType.ADD, 
      quantity: 1, 
      description: '', 
      createdAt: new Date() 
    };
    transactionServiceSpy.addTransaction.and.returnValue(of(mockTransaction));
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar como admin y cargar almacenes y movimientos', async () => {
    await component.ngOnInit();
    expect(component.esAdmin).toBeTrue();
    expect(component.esManager).toBeTrue();
    expect(warehouseServiceSpy.getWarehouses).toHaveBeenCalled();
    expect(transactionServiceSpy.getTransactions).toHaveBeenCalled();
  });

  it('debería cargar productos por almacén', () => {
    component.almacenSeleccionado = mockWarehouse;
    component.cargarProductosPorAlmacen();
    expect(inventoryServiceSpy.getInventoryByWarehouse).toHaveBeenCalledWith(mockWarehouse.id);
  });

  it('debería seleccionar tipo de movimiento correctamente', () => {
    component.selectReponer();
    expect(component.movimiento.type).toBe(TransactionType.ADD);
    component.selectEliminar();
    expect(component.movimiento.type).toBe(TransactionType.REMOVE);
    component.selectVender();
    expect(component.movimiento.type).toBe(TransactionType.SALE);
  });

  it('debería cargar producto en la transacción', () => {
    component.inventarioSeleccionado = mockInventory[0];
    component.cargarProductoEnTransaccion();
    expect(component.movimiento.product).toEqual(mockProduct);
  });

   it('debería registrar movimiento de reposición y mostrar mensaje', fakeAsync(() => {
    component.productos = JSON.parse(JSON.stringify(mockInventory));
    component.movimiento = { ...component.movimiento, product: mockProduct, type: TransactionType.ADD, quantity: 2 };
    component.registrarMovimiento();
    tick();
    expect(transactionServiceSpy.addTransaction).toHaveBeenCalled();
  }));

  it('debería registrar movimiento de venta con stock suficiente', fakeAsync(() => {
    component.productos = JSON.parse(JSON.stringify(mockInventory));
    component.movimiento = { ...component.movimiento, product: mockProduct, type: TransactionType.SALE, quantity: 5 };
    component.registrarMovimiento();
    tick(); // Avanza el observable
    expect(transactionServiceSpy.addTransaction).toHaveBeenCalled();
  }));

  it('debería mostrar advertencia si no hay stock suficiente en venta', () => {
    component.productos = JSON.parse(JSON.stringify(mockInventory));
    component.movimiento = { ...component.movimiento, product: mockProduct, type: TransactionType.SALE, quantity: 100 };
    component.registrarMovimiento();
  });

  it('debería registrar movimiento de eliminación con stock suficiente', () => {
    component.productos = JSON.parse(JSON.stringify(mockInventory));
    component.movimiento = { ...component.movimiento, product: mockProduct, type: TransactionType.REMOVE, quantity: 5 };
    component.registrarMovimiento();
    expect(transactionServiceSpy.addTransaction).toHaveBeenCalled();
  });

  it('debería mostrar advertencia si no hay stock suficiente en eliminación', () => {
    component.productos = JSON.parse(JSON.stringify(mockInventory));
    component.movimiento = { ...component.movimiento, product: mockProduct, type: TransactionType.REMOVE, quantity: 100 };
    component.registrarMovimiento();
  });
});