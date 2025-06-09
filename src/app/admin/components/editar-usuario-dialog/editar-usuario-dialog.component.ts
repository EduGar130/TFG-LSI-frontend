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
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-editar-usuario-dialog',
  standalone: true,
  templateUrl: './editar-usuario-dialog.component.html',
  styleUrls: ['./editar-usuario-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule
  ]
})
export class EditarUsuarioDialogComponent implements OnInit{
  usuario: User;

  roles: Role[] = [];
  esGlobal: boolean = false;
  almacenes: Warehouse[] = [];
  isAdmin: boolean = false;

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public warehouseService: WarehouseService,
    public roleService: RoleService,
    private authService: AuthService
  ) {
    this.usuario = { ...config.data };
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasPermiso('full_access');
    this.roleService.getRoles().subscribe((roles) => {
      if (!this.isAdmin) {
        this.roles = roles.filter(role => role.name !== 'admin' && role.name !== 'marketing');
      } else {
        this.roles = roles;
      }
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
