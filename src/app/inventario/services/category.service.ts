// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../model/category.model';
import { API_URL } from '../../common/constants';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly API_URL = `${API_URL}/categories`;
  private readonly categoryUrl = `${this.API_URL}/get`;
  private readonly deleteUrl = `${this.API_URL}/delete`;
  private readonly addUrl = `${this.API_URL}/add`;
  private readonly updateUrl = `${this.API_URL}/update`;
  
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl);
  }

  deleteCategory(id: number): Observable<Category[]> {
    return this.http.delete<Category[]>(`${this.deleteUrl}/${id}`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.addUrl, category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(this.updateUrl, category);
  }
}
