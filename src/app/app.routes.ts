import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { InventarioListComponent } from './inventario/pages/inventario-list/inventario-list.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { UsersListComponent } from './admin/pages/users-list/users-list.component';
import { MonitoringComponent } from './stats/pages/monitoring/monitoring.component';
import { AdminGuard } from './auth/guards/admin.guard';
import { WelcomeComponent } from './home/pages/welcome/welcome.component';
import { MovimientosComponent } from './movimientos/pages/movimientos/movimientos.component';
import { NotificacionesLayoutComponent } from './notificaciones/pages/notificaciones-layout/notificaciones-layout.component';
import { ReponedorGuard } from './auth/guards/reponedor.guard';
import { MarketingGuard } from './auth/guards/marketing.guard';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'home', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'inventario', component: InventarioListComponent, canActivate: [ReponedorGuard] },
  { path: 'notificaciones', component: NotificacionesLayoutComponent, canActivate: [ReponedorGuard] },
  { path: 'movimientos', component: MovimientosComponent, canActivate: [ReponedorGuard] },
  { path: 'admin', component: UsersListComponent, canActivate: [AdminGuard] },
  { path: 'stats', component: MonitoringComponent, canActivate: [MarketingGuard] },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];
