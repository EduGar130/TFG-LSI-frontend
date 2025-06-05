import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['confirm-dialog.component.scss'],
  imports: [
    CommonModule,
    ButtonModule
  ],
})
export class ConfirmDialogComponent {
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  confirmar(): void {
    this.ref.close(true);
  }

  cancelar(): void {
    this.ref.close(false);
  }
}