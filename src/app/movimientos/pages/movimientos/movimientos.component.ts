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
  providers: [MessageService],
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
  almacenSeleccionado: Warehouse | null = null;
  inventarioSeleccionado!: Inventory;
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
              private transactionService: TransactionService) {}

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
      this.almacenSeleccionado = await this.authService.getLocation();
      this.warehouseService.getWarehouses().subscribe((data) => {
        data.sort((a, b) => a.id - b.id);
        this.almacenes = data;
        this.cargarProductosPorAlmacen();
      });
    }
    this.transactionService.getTransactions().subscribe((data) => {
      data.sort((a, b) => a.id - b.id);
      this.movimientos = data;
    });
  }

  cargarProductoEnTransaccion() {
    this.movimiento.product = this.inventarioSeleccionado?.product;
  }

  registrarMovimiento() {
    const producto = this.productos.find(p => p.product.id === this.movimiento.product.id);
    this.movimiento.user.username = this.authService.getUsername();
    if (!producto) return;

    if ((this.movimiento.type === TransactionType.SALE) || (this.movimiento.type === TransactionType.REMOVE)) {
      if (producto.quantity >= this.movimiento.quantity) {
        producto.quantity -= this.movimiento.quantity;
        this.movimiento.type === TransactionType.SALE ?
        this.mostrarMensaje('success', 'Compra realizada', `Stock restante: ${producto.quantity}`) :
        this.mostrarMensaje('warn', 'Eliminación registrada', `Stock restante: ${producto.quantity}`);
      } else {
        this.mostrarMensaje('warn', 'Stock insuficiente', 'No hay suficientes unidades disponibles.');
      }
    } else {
      producto.quantity += this.movimiento.quantity;
      this.mostrarMensaje('success', 'Reposición registrada', `Nuevo stock: ${producto.quantity}`);
    }

    console.log(this.movimiento);
    this.transactionService.addTransaction(this.movimiento).subscribe((movimiento) => {
      this.movimientos.push(movimiento);
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
    if (this.almacenSeleccionado?.id !== undefined) {
      this.movimiento.warehouse = this.almacenSeleccionado;
      this.inventoryService.getInventoryByWarehouse(this.almacenSeleccionado.id).subscribe((data) => {
        data.sort((a, b) => a.id - b.id);
        this.productos = data;
      });
    }
  }
}
