import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../../auth/model/role.model';
import { API_URL } from '../../common/constants';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly API_URL = `${API_URL}/roles`;
  private readonly addUrl = `${this.API_URL}/add`;
  private readonly updateUrl = `${this.API_URL}/update`;
  private readonly deleteUrl = `${this.API_URL}/delete`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.API_URL);
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.API_URL}/${id}`);
  }

  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.addUrl, role);
  }

  updateRole(role: Role): Observable<Role> {
    return this.http.put<Role>(this.updateUrl, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.deleteUrl}/${id}`);
  }
}