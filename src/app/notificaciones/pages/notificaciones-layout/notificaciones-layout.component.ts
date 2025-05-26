import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { InventoryService } from '../../../inventario/services/inventario.service';
import { WarehouseService } from '../../../inventario/services/warehouse.service';
import { AlertService } from '../../services/alerts.service';
import { Inventory } from '../../../inventario/model/inventory.model';
import { Alert } from '../../model/alert.model';
import { Warehouse } from '../../../inventario/model/warehouse.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-notificaciones-layout',
  imports: [CommonModule,
            CardModule,
            TagModule,
            ],
  templateUrl: './notificaciones-layout.component.html',
  styleUrl: './notificaciones-layout.component.scss'
})
export class NotificacionesLayoutComponent implements OnInit {
  productos!: Inventory[];
  alertas!: Alert[];
  isAdmin: boolean = false;
  almacen!: Warehouse;
  datosCargados: boolean = false;

  constructor(private inventoryService: InventoryService, 
              private authService: AuthService,
              private warehouseService: WarehouseService,
              private alertService: AlertService) {}

  async ngOnInit(): Promise<void> {
    this.isAdmin = this.authService.hasPermiso('full_access');
    
    if(this.isAdmin) {
      this.inventoryService.getInventory().subscribe((data: Inventory[]) => {
        this.productos = data;
        this.alertService.getAlerts().subscribe((data: Alert[]) => {
        this.alertas = data;
        this.alertas = this.alertas.filter((alerta: Alert) => {
          return alerta;
        });
        this.datosCargados = true;
      });
      });
    } else {
      let warehouse: Warehouse;
      warehouse = await this.authService.getLocation();
      this.inventoryService.getInventoryByWarehouse(warehouse.id).subscribe((data: Inventory[]) => {
        this.productos = data;
      });
      this.alertService.getAlerts().subscribe((data: Alert[]) => {
        this.alertas = data;
        this.alertas = this.alertas.filter((alerta: Alert) => {
          return alerta.warehouse.id === warehouse.id;
        });
        this.datosCargados = true;
      });
    }

  }

  getUnits(alerta: Alert): number {
    const producto = alerta.product;
    const warehouse = alerta.warehouse;
    
    const inventory  = this.productos.find((inv: Inventory) => {
      return inv.product.id === producto.id && inv.warehouse.id === warehouse.id;
    });
    
    if (inventory) {
      return inventory.quantity;
    }

    return -1;
  }
}
