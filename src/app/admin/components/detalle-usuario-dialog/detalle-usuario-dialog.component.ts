/**
 * Autor: Eduardo García Romera
 * DNI: 54487155V
 * Correo: egarcia3266@alumno.uned.es
 * Título: Desarrollo de una aplicación para la gestión de inventario Online
 * Descripción: Diálogo para mostrar los detalles completos de un usuario.
 * Trabajo de Fin de Grado - UNED
 * Derechos: Este código es propiedad de Eduardo García Romera y se reserva el derecho de uso, distribución y modificación.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-detalle-usuario-dialog',
  standalone: true,
  templateUrl: './detalle-usuario-dialog.component.html',
  styleUrls: ['./detalle-usuario-dialog.component.scss'],
  imports: [CommonModule, ButtonModule]
})
export class DetalleUsuarioDialogComponent {
  usuario: any;

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.usuario = config.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}