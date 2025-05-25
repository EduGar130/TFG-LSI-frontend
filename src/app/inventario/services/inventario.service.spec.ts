import { TestBed } from '@angular/core/testing';
import { InventoryService } from './inventario.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Inventory } from '../model/inventory.model';

describe('InventarioService', () => {
  let service: InventoryService;
  let httpMock: HttpTestingController;

  const mockInventory: Inventory = { 
    id: 1,
    product: {
      id: 1,
      name: 'Producto de prueba',
      description: 'Descripción del producto de prueba',
      price: 10.99,
      stockAlertThreshold: 5,
      sku: '1',
      category: {
        id: 1,
        name: 'Categoría de prueba',
        description: 'Descripción de la categoría de prueba'
      }
    },
    warehouse: {
      id: 1,
      name: 'Almacén de prueba',
      location: 'Ubicación del almacén de prueba'
    },
    quantity: 50
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(InventoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener el inventario', () => {
    service.getInventory().subscribe(data => {
      expect(data).toEqual([mockInventory]);
    });
    const req = httpMock.expectOne(req => req.url.endsWith('/get'));
    expect(req.request.method).toBe('GET');
    req.flush([mockInventory]);
  });

  it('debería obtener inventario por almacén', () => {
    service.getInventoryByWarehouse(5).subscribe(data => {
      expect(data).toEqual([mockInventory]);
    });
    const req = httpMock.expectOne(req => /\/get\/5$/.test(req.url));
    expect(req.request.method).toBe('GET');
    req.flush([mockInventory]);
  });

  it('debería eliminar inventario', () => {
    service.deleteInventory(1).subscribe(data => {
      expect(data).toEqual([mockInventory]);
    });
    const req = httpMock.expectOne(req => /\/delete\/1$/.test(req.url));
    expect(req.request.method).toBe('DELETE');
    req.flush([mockInventory]);
  });

  it('debería añadir inventario', () => {
    service.addInventory(mockInventory).subscribe(data => {
      expect(data).toEqual(mockInventory);
    });
    const req = httpMock.expectOne(req => req.url.endsWith('/add'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockInventory);
    req.flush(mockInventory);
  });

  it('debería actualizar inventario', () => {
    service.updateInventory(mockInventory).subscribe(data => {
      expect(data).toEqual(mockInventory);
    });
    const req = httpMock.expectOne(req => /\/update\/1$/.test(req.url));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockInventory);
    req.flush(mockInventory);
  });

  it('debería obtener el archivo CSV', () => {
    const mockBlob = new Blob(['csvdata'], { type: 'text/csv' });
    service.getCsvFile().subscribe(data => {
      expect(data).toEqual(mockBlob);
    });
    const req = httpMock.expectOne(req => req.url.endsWith('/generate-csv'));
    expect(req.request.method).toBe('GET');
    req.flush(mockBlob);
  });

  it('debería importar un archivo CSV', () => {
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    service.importCsv(file).subscribe(data => {
      expect(data).toBe('importado');
    });
    const req = httpMock.expectOne(req => req.url.endsWith('/import-csv'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body.has('file')).toBeTrue();
    req.flush('importado');
  });
});