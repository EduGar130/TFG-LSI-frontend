/**
 * Autor: Eduardo García Romera
 * DNI: 54487155V
 * Correo: egarcia3266@alumno.uned.es
 * Título: Desarrollo de una aplicación para la gestión de inventario Online
 * Descripción: Componente principal de la aplicación. Contiene la estructura base y el router outlet.
 * Trabajo de Fin de Grado - UNED
 * Derechos: Este código es propiedad de Eduardo García Romera y se reserva el derecho de uso, distribución y modificación.
 */

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule]
})
export class AppComponent implements OnInit {
  isAuthenticated$: Observable<boolean> = new BehaviorSubject<boolean>(false);

   constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
      this.isAuthenticated$ = this.authService.isAuthenticated$;
  }
}
