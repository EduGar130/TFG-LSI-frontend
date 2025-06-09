/**
 * Autor: Eduardo García Romera
 * DNI: 54487155V
 * Correo: egarcia3266@alumno.uned.es
 * Título: Desarrollo de una aplicación para la gestión de inventario Online
 * Descripción: Diálogo para editar productos existentes en el inventario.
 * Trabajo de Fin de Grado - UNED
 * Derechos: Este código es propiedad de Eduardo García Romera y se reserva el derecho de uso, distribución y modificación.
 */

import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Inventory } from '../../model/inventory.model';
import { Category } from '../../model/category.model';
import { Warehouse } from '../../model/warehouse.model';
import { CategoryService } from '../../services/category.service';
import { WarehouseService } from '../../services/warehouse.service';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-editar-producto-dialog',
  standalone: true,
  templateUrl: './editar-producto-dialog.component.html',
  styleUrls: ['./editar-producto-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    SelectModule,
    CardModule,
    TextareaModule
  ]
})
export class EditarProductoDialogComponent implements OnInit {
  producto: Inventory;
  categorias!: Category[];
  esAdmin: boolean = false;
  almacenes!: Warehouse[];

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private authService: AuthService,
    public categoryService: CategoryService,
    public warehouseService: WarehouseService
  ) {
    this.producto = { ...config.data };
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categorias = data;
    });
    if (this.authService.isAdmin()) {
      this.esAdmin = true;
      this.warehouseService.getWarehouses().subscribe((data) => {
        this.almacenes = data;
      });
    } else {
      this.esAdmin = false;
      this.authService.getLocation().then((warehouse: Warehouse) => {
        this.almacenes = [warehouse];
        this.producto.warehouse = warehouse;
      });
    }
  }

  guardar(): void {
    this.dialogRef.close(this.producto);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
