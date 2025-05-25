import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoProductoDialogComponent } from './nuevo-producto-dialog.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryService } from '../../services/category.service';
import { WarehouseService } from '../../services/warehouse.service';
import { ProductService } from '../../services/product.service';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';

describe('NuevoProductoDialogComponent', () => {
  let component: NuevoProductoDialogComponent;
  let fixture: ComponentFixture<NuevoProductoDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<DynamicDialogRef>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let warehouseServiceSpy: jasmine.SpyObj<WarehouseService>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('DynamicDialogRef', ['close']);
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);
    warehouseServiceSpy = jasmine.createSpyObj('WarehouseService', ['getWarehouses', 'productAlreadyInWarehouse']);
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    categoryServiceSpy.getCategories.and.returnValue(of([]));
    warehouseServiceSpy.getWarehouses.and.returnValue(of([]));
    productServiceSpy.getProducts.and.returnValue(of([]));
    warehouseServiceSpy.productAlreadyInWarehouse.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [NuevoProductoDialogComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: dialogRefSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: WarehouseService, useValue: warehouseServiceSpy },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoProductoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario y cargar datos', () => {
    expect(component.productoForm).toBeDefined();
    expect(categoryServiceSpy.getCategories).toHaveBeenCalled();
    expect(warehouseServiceSpy.getWarehouses).toHaveBeenCalled();
    expect(productServiceSpy.getProducts).toHaveBeenCalled();
  });

  it('debería cerrar el diálogo al cancelar', () => {
    component.cancelar();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('debería cerrar el diálogo al guardar producto nuevo válido', () => {
    component.productoForm.setValue({
      name: 'Producto',
      description: 'desc',
      existingProduct: null,
      quantity: 2,
      category: null,
      warehouse: { id: 1 },
      price: 10,
      stockAlertThreshold: 1
    });
    component.guardar();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('debería marcar todos los controles como tocados si el formulario es inválido', () => {
    component.productoForm.patchValue({ name: '', warehouse: null });
    spyOn(component.productoForm, 'markAllAsTouched');
    component.guardar();
    expect(component.productoForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('debería cambiar validadores al cambiar de pestaña', () => {
    component.onTabChange(1);
    expect(component.activeTab).toBe(1);
    component.onTabChange(0);
    expect(component.activeTab).toBe(0);
  });
});