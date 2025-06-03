/**
 * Autor: Eduardo García Romera
 * DNI: 54487155V
 * Correo: egarcia3266@alumno.uned.es
 * Título: Desarrollo de una aplicación para la gestión de inventario Online
 * Descripción: Servicio de autenticación para gestionar el login y verificar sesión activa.
 * Trabajo de Fin de Grado - UNED
 * Derechos: Este código es propiedad de Eduardo García Romera y se reserva el derecho de uso, distribución y modificación.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { WarehouseService } from '../../inventario/services/warehouse.service';
import { Warehouse } from '../../inventario/model/warehouse.model';
import { API_URL, PERMISO_CREATE_USERS, PERMISO_MANAGE_INVENTORY, PERMISO_MANAGE_TRANSACTIONS, PERMISO_VIEW_ALERTS, PERMISO_VIEW_INVENTORY, PERMISO_VIEW_REPORTS, PERMISO_VIEW_STATS } from '../../common/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly API_URL = `${API_URL}/auth/login`;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private permisos: string[] = [];

  constructor(private http: HttpClient, private router: Router, private warehouseService: WarehouseService) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(this.API_URL, { username, password });
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isAuthenticatedSubject.next(true);
    this.getPermisos();
  }

  isAdmin(): boolean {
    return this.hasPermiso('full_access');
  }

  hasPermiso(permiso: string): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }
    const permisos = this.getPermisos();
    if(!permisos) {
      return false;
    }
    if(permisos.includes('full_access')){
      return true;
    }
    return permisos.includes(permiso);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getPermisos(): string[] {
    const token = this.getToken();
    if (!token) return [];
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const permisos: string[] = JSON.parse(payload?.permisos || '[]');
      this.permisos = permisos;
      return permisos;
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      return [];
    }
  }

  getUsername(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));


      return payload?.sub || null;
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      return '';
    }
  }

  async getLocation(): Promise<Warehouse> {
    const token = this.getToken();
    if (!token) return Promise.reject(new Error('Token not found'));

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const warehouseId = payload?.warehouseId || null;

      if(!warehouseId) {
        return Promise.reject(new Error('El token no contiene el ID del almacén'));
      }

      return new Promise((resolve) => {
        this.warehouseService.getWarehouses().subscribe((data) => {
          const warehouse = data.find((w) => w.id === warehouseId);
          if (warehouse) {
            resolve(warehouse);
          } else {
            resolve(Promise.reject(new Error('Warehouse not found')));
          }
        }, (error) => {
          console.error('Error fetching warehouses:', error);
          resolve(Promise.reject(new Error('Warehouse not found')));
        });
      });
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      return Promise.reject(new Error('Invalid token payload'));
    }
  }

  isManager(): boolean {
    const permisos = this.getPermisos();
    if (!permisos) {
      return false;
    }
    if (permisos.includes('full_access')) {
      return true;
    }
    return permisos.includes(PERMISO_CREATE_USERS) && permisos.includes(PERMISO_MANAGE_INVENTORY) && permisos.includes(PERMISO_VIEW_ALERTS) && permisos.includes(PERMISO_MANAGE_TRANSACTIONS);    
  }

  isMarketing(): boolean {
    const permisos = this.getPermisos();
    if (!permisos) {
      return false;
    }
    if (permisos.includes('full_access')) {
      return true;
    }
    return permisos.includes(PERMISO_VIEW_STATS) && permisos.includes(PERMISO_VIEW_REPORTS);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isReponedor(): boolean {
    const permisos = this.getPermisos();
    if (!permisos) {
      return false;
    }
    if (permisos.includes('full_access')) {
      return true;
    }
    return permisos.includes(PERMISO_VIEW_INVENTORY) && permisos.includes(PERMISO_VIEW_ALERTS) && permisos.includes(PERMISO_MANAGE_TRANSACTIONS);
  }
}
