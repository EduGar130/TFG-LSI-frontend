/**
 * Autor: Eduardo García Romera
 * DNI: 54487155V
 * Correo: egarcia3266@alumno.uned.es
 * Título: Desarrollo de una aplicación para la gestión de inventario Online
 * Descripción: Componente para gestionar productos con funcionalidades CRUD (Crear, Leer, Actualizar, Eliminar).
 * Trabajo de Fin de Grado - UNED
 * Derechos: Este código es propiedad de Eduardo García Romera y se reserva el derecho de uso, distribución y modificación.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NuevoProductoDialogComponent } from '../../components/nuevo-producto-dialog/nuevo-producto-dialog.component';
import { EditarProductoDialogComponent } from '../../components/editar-producto-dialog/editar-producto-dialog.component';
import { DetalleProductoDialogComponent } from '../../components/detalle-producto-dialog/detalle-producto-dialog.component';
import { InventoryService } from '../../services/inventario.service';
import { Inventory } from '../../model/inventory.model';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { API_URL, PERMISO_MANAGE_INVENTORY } from '../../../common/constants';
import { AuthService } from '../../../auth/services/auth.service';
import { Warehouse } from '../../model/warehouse.model';
import { SpeedDialModule } from 'primeng/speeddial';
import { BuscarDialogComponent } from '../../components/busqueda-dialog/busqueda-dialog.component';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-inventario-list',
  standalone: true,
  templateUrl: './inventario-list.component.html',
  styleUrls: ['./inventario-list.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    ToastModule,
    TabsModule,
    SpeedDialModule,
    InputGroupModule, 
    InputGroupAddonModule
  ],
  providers: [DialogService, MessageService]
})
export class InventarioListComponent implements OnInit {
  filtro: string = '';
  cargando: boolean = true;
  puedeEditar: boolean = false;
  isAdmin: boolean = false;
  almacen!: Warehouse;
  productosOriginales!: Inventory[];
  productos!: Inventory[];
  productosPorCategoria: { [key: string]: Inventory[] } = {};

  uploadUrl: string = `${API_URL}/inventory/import-csv`;

   items = [
    {
        icon: 'pi pi-download',
        command: () => {
            this.descargarCsv();
            this.messageService.add({ severity: 'success', summary: 'CSV descargado', detail: 'Se ha descargado un CSV con los datos del inventario' });
        }
    },
    {
        icon: 'pi pi-plus',
        command: () => {
            this.abrirDialogoNuevoProducto();
        }
    },
    {
        icon: 'pi pi-search',
        command: () => {
             this.abrirDialogoBusqueda();
        }
    }
  ];

  constructor(
    private dialogService: DialogService, 
    private inventoryService: InventoryService, 
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isAdmin = this.authService.isAdmin();
    if(!this.isAdmin) {
      this.almacen = await this.authService.getLocation();
    }
    this.puedeEditar = this.authService.hasPermiso(PERMISO_MANAGE_INVENTORY);
    this.inventoryService.getInventory().subscribe((data) => {
      if (!this.isAdmin) {
        data = data.filter((producto) => producto.warehouse.id === this.almacen.id);
      }
      data.sort((a, b) => a.id - b.id);
      this.productosOriginales = data;
      this.productos = this.productosOriginales;
      this.agrupaPorCategoria(data);
      this.cargando = false;
    });
  }

  private agrupaPorCategoria(productos: Inventory[]): void {
    this.productosPorCategoria = {};
    productos.forEach((producto) => {
      const categoria = producto.product.category.name;
      if (!this.productosPorCategoria[categoria]) {
        this.productosPorCategoria[categoria] = [];
      }
      this.productosPorCategoria[categoria].push(producto);
    });
  }

  getCategorias(): string[] {
    return Object.keys(this.productosPorCategoria);
  }
  

  aplicarFiltro(): void {
    const filtro = this.filtro.trim().toLowerCase();
    const filtrados = this.productosOriginales.filter((producto) =>
      producto.product.name.toLowerCase().includes(filtro)
    );
    this.agrupaPorCategoria(filtrados);
    this.productos = filtrados;
  }
  

  limpiarFiltro(): void {
    this.filtro = '';
    this.productos = [...this.productosOriginales];
    this.agrupaPorCategoria(this.productos);
  }

  abrirDialogoNuevoProducto(): void {
    const ref = this.dialogService.open(NuevoProductoDialogComponent, {
      header: 'Nuevo Producto',
      width: '700px',
      closeOnEscape: true,
      dismissableMask: true,
      baseZIndex: 10000,
      modal: true,
      closable: true
    });

    ref.onClose.subscribe((resultado) => {
      if (resultado) {
        this.inventoryService.addInventory(resultado).subscribe((nuevoProducto) => {
          this.productosOriginales.push(nuevoProducto);
          this.ngOnInit();
        });
      }
    });
  }

  abrirDialogoBusqueda(): void {
    const ref = this.dialogService.open(BuscarDialogComponent, {
      data: { filtro: this.filtro },
      header: 'Búsqueda',
      width: '700px',
      closeOnEscape: true,
      dismissableMask: true,
      baseZIndex: 10000,
      modal: true,
      closable: true
    });

    ref.onClose.subscribe((resultado) => {
      if (!resultado) {
        this.limpiarFiltro();
        return;
      }
      this.filtro =  resultado;
      this.aplicarFiltro();
    });
  }

  editarProducto(producto: any): void {
      const ref = this.dialogService.open(EditarProductoDialogComponent, {
        data: producto,
        header: 'Editar Producto',
        width: '700px',
        closeOnEscape: true,
        dismissableMask: true,
        baseZIndex: 10000,
        modal: true,
        closable: true
      });
  
      ref.onClose.subscribe((result) => {
        if (result) {
          this.inventoryService.updateInventory(result).subscribe((updatedProducto) => {
            const index = this.productosOriginales.findIndex(p => p.id === updatedProducto.id);
            if (index !== -1) {
              this.productosOriginales[index] = updatedProducto;
              this.ngOnInit();
            }
          });
        }
      });
  }

  abrirDetalle(producto: any): void {
    this.dialogService.open(DetalleProductoDialogComponent, {
      data: producto,
      header: 'Detalle del Producto',
      width: '700px',
      closeOnEscape: true,
      dismissableMask: true,
      baseZIndex: 10000,
      modal: true,
      closable: true
    });
  }

  eliminarProducto(id: number, name: string): void {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Confirmar Eliminación',
      width: '400px',
      closeOnEscape: true,
      dismissableMask: true,
      baseZIndex: 10000,
      modal: true,
      closable: true,
      data: {
        message: '¿Estás seguro de que quieres eliminar el producto ' + name + ' de tu inventario? ¡Cuidado! esta acción es permanente',
      },
    });

    ref.onClose.subscribe((confirmado) => {
      if (confirmado) {
        this.inventoryService.deleteInventory(id).subscribe(() => {
          this.productosOriginales = this.productosOriginales.filter(p => p.id !== id);
          this.ngOnInit;
        });
      }
    });
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  descargarCsv(): void {
    this.inventoryService.getCsvFile().subscribe((data) => {
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventario.csv';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  onUpload(event: any): void {
    const file: File = event.files[0];
  
    this.inventoryService.importCsv(file).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: res });
        this.ngOnInit();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error });
      }
    });
  }
}
