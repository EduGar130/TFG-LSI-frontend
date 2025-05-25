import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleProductoDialogComponent } from './detalle-producto-dialog.component';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Inventory } from '../../model/inventory.model';

describe('DetalleProductoDialogComponent', () => {
  let component: DetalleProductoDialogComponent;
  let fixture: ComponentFixture<DetalleProductoDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<DynamicDialogRef>;
  let configMock: DynamicDialogConfig;

   const mockProduct: Inventory = { 
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

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('DynamicDialogRef', ['close']);
    configMock = { data: mockProduct } as DynamicDialogConfig;

    await TestBed.configureTestingModule({
      imports: [DetalleProductoDialogComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: dialogRefSpy },
        { provide: DynamicDialogConfig, useValue: configMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleProductoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería inicializar el producto desde config', () => {
    expect(component.producto).toEqual(mockProduct);
  });

  it('debería cerrar el diálogo al llamar cerrar()', () => {
    component.cerrar();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});