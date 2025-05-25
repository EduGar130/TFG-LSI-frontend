import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CardModule } from 'primeng/card';
import { Inventory } from '../../model/inventory.model';

@Component({
  selector: 'app-detalle-producto-dialog',
  standalone: true,
  templateUrl: './detalle-producto-dialog.component.html',
  styleUrls: ['./detalle-producto-dialog.component.scss'],
  imports: [CommonModule, ButtonModule, CardModule]
})
export class DetalleProductoDialogComponent {
  producto: Inventory;

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.producto = config.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
