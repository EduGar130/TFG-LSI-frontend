/**
 * Autor: Eduardo García Romera
 * DNI: 54487155V
 * Correo: egarcia3266@alumno.uned.es
 * Título: Desarrollo de una aplicación para la gestión de inventario Online
 * Descripción: Diálogo para crear un nuevo producto en el inventario.
 * Trabajo de Fin de Grado - UNED
 * Derechos: Este código es propiedad de Eduardo García Romera y se reserva el derecho de uso, distribución y modificación.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Inventory } from '../../model/inventory.model';
import { Category } from '../../model/category.model';
import { Warehouse } from '../../model/warehouse.model';
import { CategoryService } from '../../services/category.service';
import { WarehouseService } from '../../services/warehouse.service';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { TabsModule } from 'primeng/tabs';
import { Product } from '../../model/product.model';
import { ProductService } from '../../services/product.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-nuevo-producto-dialog',
  standalone: true,
  templateUrl: './nuevo-producto-dialog.component.html',
  styleUrls: ['./nuevo-producto-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    SelectModule,
    CardModule,
    TextareaModule,
    ReactiveFormsModule,
    TabsModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class NuevoProductoDialogComponent implements OnInit {
  productoForm!: FormGroup;
  categorias!: Category[];
  almacenes!: Warehouse[];
  productos!: Product[];
  activeTab: number = 0;

  constructor(
    public dialogRef: DynamicDialogRef,
    public categoryService: CategoryService,
    public warehouseService: WarehouseService,
    public productService: ProductService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group(
      {
        name: [''],
        description: [''],
        existingProduct: [null],
        quantity: [1, [Validators.required, Validators.min(1)]],
        category: [null],
        warehouse: [null, Validators.required],
        price: [0.00, Validators.min(0.00)],
        stockAlertThreshold: [0, Validators.min(0)],
      }
    );

    this.categoryService.getCategories().subscribe((data) => {
      this.categorias = data;
    });
    this.warehouseService.getWarehouses().subscribe((data) => {
      this.almacenes = data;
    });
    this.productService.getProducts().subscribe((data) => {
      this.productos = data;
    });
  }

  guardar(): void {
    if (this.productoForm.valid) {
      const formValues = this.productoForm.value;
      const producto: Inventory = {
        id: -1,
        product: {
          id: -1,
          name: formValues.name,
          description: formValues.description,
          category: formValues.category,
          price: formValues.price,
          sku: '',
          stockAlertThreshold: formValues.stockAlertThreshold,
        },
        warehouse: formValues.warehouse,
        quantity: formValues.quantity,
      };
      // Si se selecciona un producto existente, se asigna su ID al nuevo producto
      if (formValues.existingProduct) {
        producto.product.id = formValues.existingProduct.id;
        this.warehouseService.productAlreadyInWarehouse(producto.warehouse.id, producto.product.id).subscribe((exists) => {
          if(exists) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'El producto ya existe en el almacén seleccionado. Por favor, selecciona otro producto o almacén.',
            });
            return;
          }
          this.dialogRef.close(producto);
        });
      } else {
        producto.product.id = -1; // ID nuevo para un producto nuevo
        this.dialogRef.close(producto);
      }
      
    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  onTabChange(index: number): void {
    this.activeTab = index;

    if (this.activeTab === 0) {
      this.productoForm.get('name')?.setValidators([Validators.required]);
      this.productoForm.get('description')?.setValidators([Validators.required]);
      this.productoForm.get('category')?.setValidators([Validators.required]);
      this.productoForm.get('price')?.setValidators([Validators.required]);
      this.productoForm.get('stockAlertThreshold')?.setValidators([Validators.required]);
      this.productoForm.get('existingProduct')?.clearValidators();
    } else if (this.activeTab === 1) {
      this.productoForm.get('name')?.clearValidators();
      this.productoForm.get('description')?.clearValidators();
      this.productoForm.get('category')?.clearValidators();
      this.productoForm.get('price')?.clearValidators();
      this.productoForm.get('stockAlertThreshold')?.clearValidators();
      this.productoForm.get('existingProduct')?.setValidators([Validators.required]);
    }

    // Actualiza el estado de los controles
    this.productoForm.get('name')?.updateValueAndValidity();
    this.productoForm.get('description')?.updateValueAndValidity();
    this.productoForm.get('category')?.updateValueAndValidity();
    this.productoForm.get('price')?.updateValueAndValidity();
    this.productoForm.get('stockAlertThreshold')?.updateValueAndValidity();
    this.productoForm.get('existingProduct')?.updateValueAndValidity();
  }
}