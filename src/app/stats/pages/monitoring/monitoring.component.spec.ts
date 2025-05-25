import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonitoringComponent } from './monitoring.component';
import { InventoryService } from '../../../inventario/services/inventario.service';
import { WarehouseService } from '../../../inventario/services/warehouse.service';
import { AuthService } from '../../../auth/services/auth.service';
import { TransactionService } from '../../../movimientos/services/transaction.service';
import { ReportService } from '../../services/report.service';
import { of } from 'rxjs';
import { TransactionType } from '../../../movimientos/model/transaction.model';

describe('MonitoringComponent', () => {
  let component: MonitoringComponent;
  let fixture: ComponentFixture<MonitoringComponent>;
  let inventoryServiceSpy: jasmine.SpyObj<InventoryService>;
  let warehouseServiceSpy: jasmine.SpyObj<WarehouseService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;
  let reportServiceSpy: jasmine.SpyObj<ReportService>;

  const mockCategory = { id: 1, name: 'Cat', description: 'desc' };
  const mockWarehouse = { id: 1, name: 'A', location: 'loc' };
  const mockProduct = {
    id: 1,
    name: 'P',
    description: '',
    price: 1,
    stockAlertThreshold: 1,
    sku: 'SKU1',
    category: mockCategory
  };
  const mockInventory = [{ id: 1, product: mockProduct, warehouse: mockWarehouse, quantity: 10 }];
  const mockUser = {
    id: 1,
    username: 'user',
    email: 'user@mail.com',
    role: { id: 1, name: 'admin', permissions: '', isGlobal: true },
    warehouse: mockWarehouse
  };
  const mockMovimientos = [
    {
      id: 1,
      product: mockProduct,
      warehouse: mockWarehouse,
      quantity: 5,
      type: 'SALE' as unknown as TransactionType,
      user: mockUser,
      description: 'Venta realizada',
      createdAt: new Date()
    },
    {
      id: 2,
      product: mockProduct,
      warehouse: mockWarehouse,
      quantity: 2,
      type: 'ADD' as unknown as TransactionType,
      user: mockUser,
      description: 'Producto añadido',
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    inventoryServiceSpy = jasmine.createSpyObj('InventoryService', ['getInventory']);
    warehouseServiceSpy = jasmine.createSpyObj('WarehouseService', ['getWarehouses']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsuario']);
    transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['getTransactions']);
    reportServiceSpy = jasmine.createSpyObj('ReportService', ['generarEstadisticasPDF']);

    inventoryServiceSpy.getInventory.and.returnValue(of(mockInventory));
    transactionServiceSpy.getTransactions.and.returnValue(of(mockMovimientos));

    await TestBed.configureTestingModule({
      imports: [MonitoringComponent],
      providers: [
        { provide: InventoryService, useValue: inventoryServiceSpy },
        { provide: WarehouseService, useValue: warehouseServiceSpy },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: ReportService, useValue: reportServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería cargar movimientos y productos en ngOnInit', () => {
    expect(transactionServiceSpy.getTransactions).toHaveBeenCalled();
    expect(inventoryServiceSpy.getInventory).toHaveBeenCalled();
    expect(component.movimientos.length).toBe(2);
    expect(component.productos.length).toBeGreaterThanOrEqual(0);
    expect(component.cargando).toBeFalse();
  });

  it('debería preparar el gráfico de ventas por categoría', () => {
    component.movimientos = mockMovimientos;
    component.prepararChartVentasPorCategoria();
    expect(component.chartVentasPorCategoria).toBeDefined();
    expect(component.chartVentasPorCategoria.labels.length).toBeGreaterThan(0);
  });

  it('debería preparar el gráfico por tipo de transacción', () => {
    component.movimientos = mockMovimientos;
    component.prepararChartPorTipo();
    expect(component.chartTipoTransaccion).toBeDefined();
    expect(component.chartTipoTransaccion.labels.length).toBe(3);
  });

  it('debería preparar el gráfico de ventas por almacén', () => {
    component.movimientos = mockMovimientos;
    component.prepararChartVentasPorAlmacen();
    expect(component.chartVentasPorAlmacen).toBeDefined();
    expect(component.chartVentasPorAlmacen.labels.length).toBeGreaterThan(0);
  });

  it('debería preparar el gráfico de ranking de empleados', () => {
    component.movimientos = mockMovimientos;
    component.prepararChartRankingEmpleados();
    expect(component.chartRankingEmpleados).toBeDefined();
    expect(component.chartRankingEmpleados.labels.length).toBeGreaterThan(0);
  });

  it('debería preparar el gráfico de ranking de productos', () => {
    component.movimientos = mockMovimientos;
    component.prepararChartRankingProductos();
    expect(component.chartRankingProductos).toBeDefined();
    expect(component.chartRankingProductos.labels.length).toBeGreaterThan(0);
  });

  it('debería preparar el gráfico de ventas mensuales por SKU', () => {
    component.movimientos = mockMovimientos;
    component.obtenerVentasPorSku('SKU1');
    expect(component.chartVentasMensuales).toBeDefined();
    expect(component.chartVentasMensuales.labels.length).toBe(12);
  });

  it('debería llamar a generarEstadisticasPDF en generarReportePDF', () => {
    const fakeBlob = new Blob(['test'], { type: 'application/pdf' });
    reportServiceSpy.generarEstadisticasPDF.and.returnValue(of(fakeBlob));
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
    spyOn(document, 'createElement').and.callFake(() => {
      return { href: '', download: '', click: () => {} } as any;
    });
    spyOn(window.URL, 'revokeObjectURL');

    component.skuSeleccionado = 'SKU1';
    component.generarReportePDF();

    expect(reportServiceSpy.generarEstadisticasPDF).toHaveBeenCalledWith('SKU1');
  });
});
