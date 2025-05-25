import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { DialogService } from 'primeng/dynamicdialog';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { User } from '../../../auth/model/user.model';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUsers: User[] = [
    { id: 1, username: 'juan', email: 'juan@mail.com', passwordHash: '', warehouse: { id: 1, name: 'A', location: 'test' }, role: { id: 1, name: 'admin', permissions: '', isGlobal: true } },
    { id: 2, username: 'ana', email: 'ana@mail.com', passwordHash: '', warehouse: { id:2, name: 'B', location: 'test'}, role: { id: 2, name: 'user', permissions: '', isGlobal: false } }
  ];

  beforeEach(async () => {
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'updateUser', 'addUser', 'deleteUser']);

    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    userServiceSpy.updateUser.and.returnValue(of(mockUsers[0]));
    userServiceSpy.addUser.and.returnValue(of(mockUsers[0]));
    userServiceSpy.deleteUser.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar usuarios al inicializar', () => {
    expect(userServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.usuarios.length).toBe(2);
    expect(component.usuariosFiltrados.length).toBe(2);
    expect(component.cargando).toBeFalse();
  });

  it('debería filtrar usuarios por nombre', () => {
    component.filtro = 'juan';
    component.aplicarFiltro();
    expect(component.usuariosFiltrados.length).toBe(1);
    expect(component.usuariosFiltrados[0].username).toBe('juan');
  });

  it('debería limpiar el filtro', () => {
    component.filtro = 'juan';
    component.aplicarFiltro();
    component.limpiarFiltro();
    expect(component.filtro).toBe('');
    expect(component.usuariosFiltrados.length).toBe(2);
  });

  it('trackById debería devolver el id del usuario', () => {
    const user = mockUsers[0];
    expect(component.trackById(0, user)).toBe(user.id);
  });
});