/**
 * Autor: Eduardo García Romera
 * DNI: 54487155V
 * Correo: egarcia3266@alumno.uned.es
 * Título: Desarrollo de una aplicación para la gestión de inventario Online
 * Descripción: Diálogo para editar la información básica de un usuario.
 * Trabajo de Fin de Grado - UNED
 * Derechos: Este código es propiedad de Eduardo García Romera y se reserva el derecho de uso, distribución y modificación.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { WarehouseService } from '../../../inventario/services/warehouse.service';
import { Role } from '../../../auth/model/role.model';
import { RoleService } from '../../services/role.service';
import { Warehouse } from '../../../inventario/model/warehouse.model';
import { User } from '../../../auth/model/user.model';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-nuevo-usuario-dialog',
  standalone: true,
  templateUrl: './nuevo-usuario-dialog.component.html',
  styleUrls: ['./nuevo-usuario-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule
  ]
})
export class NuevoUsuarioDialogComponent implements OnInit{
  usuario: User;

  roles: Role[] = [];
  esGlobal: boolean = false;
  almacenes: Warehouse[] = [];

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public warehouseService: WarehouseService,
    public roleService: RoleService
  ) {
    this.usuario = { ...config.data };
  }

  ngOnInit(): void {
    this.roleService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });

    this.warehouseService.getWarehouses().subscribe((warehouses) => {
      this.almacenes = warehouses;
    });

    this.esGlobal = this.usuario.role.isGlobal;
  }

  guardar(): void {
    this.dialogRef.close(this.usuario);
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  onRolSeleccionado(event: any): void {
    this.esGlobal = event.value.isGlobal;
    if (this.esGlobal) {
      this.usuario.warehouse = null;
    }
  }
}
