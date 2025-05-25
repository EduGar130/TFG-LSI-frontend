/**
 * Autor: Eduardo García Romera
 * DNI: 54487155V
 * Correo: egarcia3266@alumno.uned.es
 * Título: Desarrollo de una aplicación para la gestión de inventario Online
 * Descripción: Componente Navbar con acciones de tema y logout usando Angular Material.
 * Trabajo de Fin de Grado - UNED
 * Derechos: Este código es propiedad de Eduardo García Romera y se reserva el derecho de uso, distribución y modificación.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MenubarModule } from 'primeng/menubar';
import { PERMISO_CREATE_USERS, PERMISO_MANAGE_INVENTORY, PERMISO_MANAGE_TRANSACTIONS, PERMISO_VIEW_ALERTS, PERMISO_VIEW_STATS } from '../../../common/constants';


@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, ButtonModule, MenubarModule ]
})

export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  currentTheme: 'light' | 'dark' = 'light';
  isAuthenticated$: Observable<boolean> = new BehaviorSubject<boolean>(false);
  selectedItem: string | null = null;
  private rolesSub!: Subscription;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.rolesSub = combineLatest([
      this.authService.isAuthenticated$,
      this.authService.getPermisos()
    ]).subscribe(([isAuthenticated]) => {
      if (isAuthenticated) {
        this.buildMenu();
      } else {
        this.items = [];
      }
    });
    this.buildMenu();
  }

    buildMenu(): void {
    const hayNotificaciones = true;
    const items: MenuItem[] = [];

    if (this.authService.hasPermiso(PERMISO_VIEW_STATS)) {
      items.unshift({
        icon: 'pi pi-chart-bar',
        tooltip: 'Estadísticas',
        tooltipPosition: 'right',
        command: () => {
          this.selectItem('stats');
          this.navigateStats();
        }
      });
    }

    if (this.authService.hasPermiso(PERMISO_MANAGE_TRANSACTIONS)) {
      items.unshift({
        icon: 'pi pi-arrow-right-arrow-left',
        tooltip: 'Movimientos',
        tooltipPosition: 'right',
        command: () => {
          this.selectItem('movimientos');
          this.router.navigate(['/movimientos']);
        }
      });
    }

    if (this.authService.hasPermiso(PERMISO_MANAGE_INVENTORY)) {
      items.unshift({
        icon: 'pi pi-clipboard',
        tooltip: 'Inventario',
        tooltipPosition: 'right',
        command: () => {
          this.selectItem('inventario');
          this.navigateInventario();
        }
      });
    }

    if (this.authService.hasPermiso(PERMISO_VIEW_ALERTS)) {
      items.unshift({
        icon: 'pi pi-bell',
        tooltip: 'Notificaciones',
        tooltipPosition: 'right',
        command: () => {
          this.selectItem('notificaciones');
          this.navigateNotificaciones();
        },
        styleClass: hayNotificaciones ? 'badge-notificacion' : '',
        id: 'notificaciones'
      });
    }

    if (this.authService.hasPermiso(PERMISO_CREATE_USERS)) {
      items.push({
        icon: 'pi pi-users',
        tooltip: 'Administración de usuarios',
        tooltipPosition: 'right',
        
        command: () => {
          this.selectItem('admin');
          this.navigateAdmin();
        }
      });
    }
    items.push({
        icon: 'pi pi-sun',
        tooltip: 'Cambiar tema',
        tooltipPosition: 'right',
        command: () => {
          this.toggleTheme();
        }
      });
    items.push({
        icon: 'pi pi-sign-out',
        tooltip: 'Cerrar sesión',
        tooltipPosition: 'right',
        command: () => {
          this.selectItem('logout');
          this.logout();
        }
    });
    items.unshift({
        icon: 'pi pi-home',
        tooltip: 'Inicio',
        tooltipPosition: 'right',
        command: () => {
          this.selectItem('home');
          this.router.navigate(['/home']);
        }
      });
    this.items = items.map(item => ({
      ...item,
      'aria-label': item.tooltip,
      'aria-current': this.selectedItem === item.tooltip?.toLowerCase() ? 'page' : null
    }));
  }


  
  selectItem(item: string): void {
    this.selectedItem = item;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.getCurrentTheme();
    this.items.find(i => i.icon === 'pi pi-sun');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateAdmin(): void {
    this.router.navigate(['/admin']);
  }

  navigateStats(): void {
    this.router.navigate(['/stats']);
  }

  navigateInventario(): void {
    this.router.navigate(['/inventario']);
  }

  navigateNotificaciones(): void {
    this.router.navigate(['/notificaciones']);
  }

  ngOnDestroy(): void {
    this.rolesSub?.unsubscribe();
  }
}
