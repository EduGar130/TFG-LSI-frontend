import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../auth/model/user.model';
import { API_URL } from '../../common/constants';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${API_URL}/users`;
  private readonly deleteUrl = `${this.API_URL}/delete`;
  private readonly addUrl = `${this.API_URL}/add`;
  private readonly updateUrl = `${this.API_URL}/update`;
  
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  deleteUser(id: number): Observable<User[]> {
    return this.http.delete<User[]>(`${this.deleteUrl}/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.addUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(this.updateUrl, user);
  }
}
