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
import { CategoryService } from '../../services/category.service';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-busqueda-dialog',
  standalone: true,
  templateUrl: './busqueda-dialog.component.html',
  styleUrls: ['./busqueda-dialog.component.scss'],
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
export class BuscarDialogComponent implements OnInit {
  filtro: string = '';

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public categoryService: CategoryService,
  ) {
  }

  ngOnInit(): void {
    this.filtro = this.config.data.filtro || '';
  }

  buscar(): void {
    if (this.filtro.trim() === '') {
      this.dialogRef.close('');
      return;
    }

    this.dialogRef.close(this.filtro);
  }

  eliminar(): void {
    this.dialogRef.close('');
  }
}
