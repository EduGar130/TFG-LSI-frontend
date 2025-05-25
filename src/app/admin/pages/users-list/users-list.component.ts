/**
 * Autor: Eduardo García Romera
 * DNI: 54487155V
 * Correo: egarcia3266@alumno.uned.es
 * Título: Desarrollo de una aplicación para la gestión de inventario Online
 * Descripción: Componente para la gestión de usuarios (roles, detalles y edición).
 * Trabajo de Fin de Grado - UNED
 * Derechos: Este código es propiedad de Eduardo García Romera y se reserva el derecho de uso, distribución y modificación.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { EditarUsuarioDialogComponent } from '../../components/editar-usuario-dialog/editar-usuario-dialog.component';
import { NuevoUsuarioDialogComponent } from '../../components/nuevo-usuario-dialog/nuevo-usuario-dialog.component';
import { DetalleUsuarioDialogComponent } from '../../components/detalle-usuario-dialog/detalle-usuario-dialog.component';
import { User } from '../../../auth/model/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DropdownModule],
  providers: [DialogService]
})
export class UsersListComponent implements OnInit {
  columnas: string[] = ['usario', 'email', 'almacen', 'rol', 'acciones'];
  usuarios: User[] = [];
  usuariosFiltrados: User[] = [];
  cargando: boolean = true;
  filtro: string = '';

  constructor(private dialogService: DialogService, private userService: UserService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  abrirEditarUsuario(usuario: User): void {
    const ref = this.dialogService.open(EditarUsuarioDialogComponent, {
      data: usuario,
      header: 'Editar Usuario',
      width: '500px',
      modal: true,
      closable: true,
      closeOnEscape: true,
      dismissableMask: true,
    });

    ref.onClose.subscribe((usuarioActualizado: User) => {
      if (usuarioActualizado) {
        this.userService.updateUser(usuarioActualizado).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }

  abrirNuevoUsuario(): void {
    const nuevoUsuario: User = {
      id: 0,
      username: '',
      email: '',
      passwordHash: '',
      warehouse: null,
      role: {
        id: 0,
        name: '',
        permissions: '',
        isGlobal: false
      }
    };
    const ref = this.dialogService.open(NuevoUsuarioDialogComponent, {
      data: nuevoUsuario,
      header: 'Nuevo Usuario',
      width: '500px',
      modal: true,
      closable: true,
      closeOnEscape: true,
      dismissableMask: true,
    });
    ref.onClose.subscribe((usuarioCreado: User) => {
      if (usuarioCreado) {
        this.userService.addUser(usuarioCreado).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }

  abrirDetalleUsuario(usuario: User): void {
    this.dialogService.open(DetalleUsuarioDialogComponent, {
      data: usuario,
      header: 'Detalle del Usuario',
      width: '500px',
      closeOnEscape: true,
      dismissableMask: true,
      baseZIndex: 10000,
      modal: true,
      closable: true
    });
  }

  trackById(index: number, item: User): number {
    return item.id;
  }  
  
  aplicarFiltro(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.username?.toLowerCase().includes(filtroLower) ||
      u.email?.toLowerCase().includes(filtroLower) ||
      u.warehouse?.name?.toLowerCase().includes(filtroLower) ||
      u.role?.name?.toLowerCase().includes(filtroLower)
    );
  }

  limpiarFiltro(): void {
    this.filtro = '';
    this.usuariosFiltrados = [...this.usuarios];
  }

  obtenerUsuarios(): void {
   this.userService.getUsers().subscribe(
      (usuarios: User[]) => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = [...this.usuarios];
        this.usuariosFiltrados.sort((a, b) => a.id - b.id);
        this.cargando = false;
    });
  }

  confirmarEliminarUsuario(usuario: User): void {
    if (confirm(`¿Está seguro de que desea eliminar al usuario ${usuario.username}?`)) {
      this.userService.deleteUser(usuario.id).subscribe(() => {
        this.obtenerUsuarios();
      });
    }
  }
}
