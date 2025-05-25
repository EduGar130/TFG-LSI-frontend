// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';
import { API_URL } from '../../common/constants';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = `${API_URL}/products`;
  private readonly productUrl = `${this.API_URL}/get`;
  private readonly deleteUrl = `${this.API_URL}/delete`;
  private readonly addUrl = `${this.API_URL}/add`;
  private readonly updateUrl = `${this.API_URL}/update`;
  
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productUrl);
  }

  deleteProduct(id: number): Observable<Product[]> {
    return this.http.delete<Product[]>(`${this.deleteUrl}/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.addUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(this.updateUrl, product);
  }
}
