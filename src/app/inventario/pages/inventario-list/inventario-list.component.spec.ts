import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioListComponent } from './inventario-list.component';
import { DialogService } from 'primeng/dynamicdialog';
import { InventoryService } from '../../services/inventario.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { throwError } from 'rxjs';

describe('InventarioListComponent', () => {
  let component: InventarioListComponent;
  let fixture: ComponentFixture<InventarioListComponent>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let inventoryServiceSpy: jasmine.SpyObj<InventoryService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  const mockCategory = { id: 1, name: 'Cat', description: 'desc' };
  const mockProduct = { id: 1, name: 'Prod', description: '', price: 1, stockAlertThreshold: 1, sku: '', category: mockCategory };
  const mockInventory = [{ id: 1, product: mockProduct, warehouse: { id: 1, name: 'A', location: 'loc' }, quantity: 10 }];

  beforeEach(async () => {
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
    inventoryServiceSpy = jasmine.createSpyObj('InventoryService', [
      'getInventory', 'addInventory', 'updateInventory', 'deleteInventory', 'getCsvFile', 'importCsv'
    ]);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    inventoryServiceSpy.getInventory.and.returnValue(of(mockInventory));
    inventoryServiceSpy.addInventory.and.returnValue(of(mockInventory[0]));
    inventoryServiceSpy.updateInventory.and.returnValue(of(mockInventory[0]));
    inventoryServiceSpy.deleteInventory.and.returnValue(of([]));
    inventoryServiceSpy.getCsvFile.and.returnValue(of(new Blob(['csv'], { type: 'text/csv' })));
    inventoryServiceSpy.importCsv.and.returnValue(of('importado'));

    await TestBed.configureTestingModule({
      imports: [InventarioListComponent, HttpClientTestingModule],
      providers: [
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: InventoryService, useValue: inventoryServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InventarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería cargar productos y agrupar por categoría en ngOnInit', () => {
    expect(inventoryServiceSpy.getInventory).toHaveBeenCalled();
    expect(component.productos.length).toBe(1);
    expect(component.productosPorCategoria['Cat'].length).toBe(1);
    expect(component.cargando).toBeFalse();
  });

  it('debería filtrar productos por nombre', () => {
    component.filtro = 'prod';
    component.aplicarFiltro();
    expect(component.productos.length).toBe(1);
    component.filtro = 'noexiste';
    component.aplicarFiltro();
    expect(component.productos.length).toBe(0);
  });

  it('debería limpiar el filtro', () => {
    component.filtro = 'prod';
    component.aplicarFiltro();
    component.limpiarFiltro();
    expect(component.filtro).toBe('');
    expect(component.productos.length).toBe(1);
  });

  it('trackById debería devolver el id', () => {
    expect(component.trackById(0, mockInventory[0])).toBe(1);
  });

  it('debería descargar el CSV', () => {
    spyOn(document, 'createElement').and.callFake(() => {
      return { href: '', download: '', click: () => {} } as any;
    });
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
    spyOn(window.URL, 'revokeObjectURL');
    component.descargarCsv();
    expect(inventoryServiceSpy.getCsvFile).toHaveBeenCalled();
  });
});