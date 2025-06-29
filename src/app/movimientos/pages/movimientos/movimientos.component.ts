import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { Inventory } from '../../../inventario/model/inventory.model';
import { InventoryService } from '../../../inventario/services/inventario.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Warehouse } from '../../../inventario/model/warehouse.model';
import { WarehouseService } from '../../../inventario/services/warehouse.service';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { Transaction, TransactionType } from '../../model/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { DialogService } from 'primeng/dynamicdialog';
import { DetalleDialogComponent } from '../../components/detalle-dialog/detalle-dialog.component';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    InputNumberModule,
    RadioButtonModule,
    ButtonModule,
    ToastModule,
    TabsModule,
    CardModule,
    TableModule,
    InputTextModule,
    BadgeModule
  ],
  providers: [MessageService, DialogService],
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})
export class MovimientosComponent implements OnInit {
  public TransactionType = TransactionType;

  productos!: Inventory[];
  almacenes!: Warehouse[];
  movimientos!: Transaction[];
  esAdmin: boolean = false;
  esManager: boolean = false;
  almacen!: Warehouse;
  almacenSeleccionado: Warehouse | null = null;
  inventarioSeleccionado!: Inventory | null;
  activeTab: number = 0;
  movimiento: Transaction = {
    id: 0,
    product: {
      id: 0,
      name: '',
      sku: '',
      description: '',
      price: 0,
      stockAlertThreshold: 0,
      category: {
        id: 0,
        name: '',
        description: ''
      }
    },
    warehouse: {
      id: 0,
      name: '',
      location: ''
    },
    user: {
      id: 0,
      username: '',
      email: '',
      role: {
        id: 0,
        name: '',
        permissions: '',
        isGlobal: false
      },
      warehouse: {
        id: 0,
        name: '',
        location: ''
      }
    },
    type: TransactionType.NULL,
    quantity: 0,
    description: '',
    createdAt: new Date()
  };
  
  constructor(private messageService: MessageService, 
              private inventoryService: InventoryService, 
              private authService: AuthService,
              private warehouseService: WarehouseService,
              private transactionService: TransactionService,
              private dialogService: DialogService ) {}

  async ngOnInit(): Promise<void> {
    if(this.authService.isAdmin()) {
      this.esAdmin = true;
      this.esManager = true;
      this.warehouseService.getWarehouses().subscribe((data) => {
        data.sort((a, b) => a.id - b.id);
        this.almacenes = data;
      });
    }else {
      if(this.authService.isManager()) {
        this.esManager = true;
      }
      this.almacen = await this.authService.getLocation();
      this.almacenSeleccionado = this.almacen;
      this.warehouseService.getWarehouses().subscribe((data) => {
        data.sort((a, b) => a.id - b.id);
        this.almacenes = data;
        this.cargarProductosPorAlmacen();
      });
    }
    this.transactionService.getTransactions().subscribe((data) => {
      data.sort((a, b) => a.id - b.id);
      if (!this.esAdmin) {
        data = data.filter((movimiento) => movimiento.warehouse.id === this.almacen.id);
      }
      this.movimientos = data;
    });
  }

  cargarProductoEnTransaccion() {
    if (this.inventarioSeleccionado && this.inventarioSeleccionado.product) {
      this.movimiento.product = this.inventarioSeleccionado.product;
    }
  }

  registrarMovimiento() {
    const producto = this.productos.find(p => p.product.id === this.movimiento.product.id);
    this.movimiento.user.username = this.authService.getUsername();
    if (!producto) {
      this.mostrarMensaje('warn', 'Producto no seleccionado', 'Por favor, seleccione un producto válido.');
      return;
    }
    if (this.movimiento.type === TransactionType.NULL) {
      this.mostrarMensaje('warn', 'Tipo de movimiento no seleccionado', 'Por favor, seleccione un tipo de movimiento.');
      return;
    }
    if (this.movimiento.quantity <= 0) {
      this.mostrarMensaje('warn', 'Cantidad inválida', 'La cantidad debe ser mayor a cero.');
      return;
    }

    if ((this.movimiento.type === TransactionType.SALE) || (this.movimiento.type === TransactionType.REMOVE)) {
      if (producto.quantity >= this.movimiento.quantity) {
        producto.quantity -= this.movimiento.quantity;
        this.movimiento.type === TransactionType.SALE ?
        this.mostrarMensaje('success', 'Venta registrada', `Stock restante: ${producto.quantity}`) :
        this.mostrarMensaje('warn', 'Eliminación registrada', `Stock restante: ${producto.quantity}`);
      } else {
        this.mostrarMensaje('warn', 'Stock insuficiente', 'No hay suficientes unidades disponibles.');
        return;
      }
    } else {
      producto.quantity += this.movimiento.quantity;
      this.mostrarMensaje('success', 'Reposición registrada', `Nuevo stock: ${producto.quantity}`);
    }
    this.transactionService.addTransaction(this.movimiento).subscribe((movimiento) => {
      this.movimientos.push(movimiento);
      this.transactionService.notifyTransactionsChanged();
    });;
  }

  mostrarMensaje(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }

  selectReponer() {
    this.movimiento.type = TransactionType.ADD;
  }

  selectEliminar() {
    this.movimiento.type = TransactionType.REMOVE;
  }

  selectVender() {
    this.movimiento.type = TransactionType.SALE;
  }

  cargarProductosPorAlmacen() {
    if(this.almacenSeleccionado === null) {
      this.productos = [];
      this.inventarioSeleccionado = null;
    }else{
      if (this.almacenSeleccionado?.id !== undefined) {
        this.movimiento.warehouse = this.almacenSeleccionado;
        this.inventoryService.getInventoryByWarehouse(this.almacenSeleccionado.id).subscribe((data) => {
          data.sort((a, b) => a.id - b.id);
          this.productos = data.map((inventory) => ({
              ...inventory,
              label: `${inventory.product.name} (${inventory.product.sku})`
            }));
        });
      }
    }
  }

  verDetalleMovimiento(movimiento: Transaction) {
   this.dialogService.open(DetalleDialogComponent, {
      header: 'Detalles del Movimiento',
      width: '700px',
      data: movimiento,
      dismissableMask: true
    });
  }
}
