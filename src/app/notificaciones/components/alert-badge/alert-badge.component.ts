import { Component, OnInit } from "@angular/core";
import { AlertService } from "../../services/alerts.service";
import { Alert } from "../../model/alert.model";
import { BadgeModule } from 'primeng/badge';
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { PERMISO_VIEW_ALERTS } from "../../../common/constants";
import { AuthService } from "../../../auth/services/auth.service";
import { Warehouse } from "../../../inventario/model/warehouse.model";
import { Subscription } from "rxjs";
import { TransactionService } from "../../../movimientos/services/transaction.service";

@Component({
  selector: 'app-alert-badge',
  standalone: true,
  templateUrl: './alert-badge.component.html',
  styleUrls: ['./alert-badge.component.scss'],
  imports: [
    BadgeModule,
    CommonModule
  ]
})
export class AlertBadgeComponent implements OnInit {

  alerts: Alert[] = [];
  isAdmin: boolean = false;
  datosCargados: boolean = false;
  private transactionsSub!: Subscription;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService,
    private transactionService: TransactionService
  ) {
  }

  ngOnInit(): void {
    this.loadAlerts();
    this.transactionsSub = this.transactionService.transactionsChanged$.subscribe(() => {
      this.loadAlerts();
    });
  }

  async loadAlerts(): Promise<void> {
    if(this.authService.hasPermiso(PERMISO_VIEW_ALERTS)){
      this.alertService.getAlerts().subscribe({
        next: async (alerts: Alert[]) => {
          this.isAdmin = this.authService.hasPermiso('full_access');
              
              if(this.isAdmin) {
                this.alerts = alerts.map((alert: Alert) => ({
                  ...alert,
                  activa: true
                }));
                this.datosCargados = true;
              } else {
                let warehouse: Warehouse;
                warehouse = await this.authService.getLocation();
                this.alertService.getAlerts().subscribe((data: Alert[]) => {
                  this.alerts = data;
                  this.alerts = this.alerts.filter((alerta: Alert) => {
                    return alerta.warehouse.id === warehouse.id;
                  }).map((alerta: Alert) => ({
                    ...alerta,
                    activa: true
                  }));
                  this.datosCargados = true;
                });
              }
        },
        error: (error) => {
          console.error('Error loading alerts:', error);
        }
      });
    }
  }

  routeAlerts(): void {
    this.router.navigate(['/notificaciones']);
  }
}
