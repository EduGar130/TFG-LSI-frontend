/**
 * Autor: Eduardo García Romera
 * DNI: 54487155V
 * Correo: egarcia3266@alumno.uned.es
 * Título: Desarrollo de una aplicación para la gestión de inventario Online
 * Descripción: Servicio para manejar el cambio entre modo claro y oscuro de la aplicación.
 * Trabajo de Fin de Grado - UNED
 * Derechos: Este código es propiedad de Eduardo García Romera y se reserva el derecho de uso, distribución y modificación.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly THEME_KEY = 'preferred-theme';
  private readonly DARK_CLASS = 'app-dark';
  
  private themeSubject = new BehaviorSubject<'light' | 'dark'>(this.getCurrentTheme());
  theme$ = this.themeSubject.asObservable();
  
  constructor() {
    this.loadTheme();
  }



  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(this.THEME_KEY, theme);

    if (theme === 'dark') {
      document.documentElement.classList.add(this.DARK_CLASS);
    } else {
      document.documentElement.classList.remove(this.DARK_CLASS);
    }

    this.themeSubject.next(theme);
  }

  getCurrentTheme(): 'light' | 'dark' {
    return localStorage.getItem(this.THEME_KEY) === 'dark' ? 'dark' : 'light';
  }

  loadTheme(): void {
    this.setTheme(this.getCurrentTheme());
  }
}
