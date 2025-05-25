// src/app/services/warehouse.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Warehouse } from '../model/warehouse.model';
import { API_URL } from '../../common/constants';


@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private readonly API_URL = `${API_URL}/warehouses`;
  private readonly warehouseUrl = `${this.API_URL}/get`;
  private readonly deleteUrl = `${this.API_URL}/delete`;
  private readonly addUrl = `${this.API_URL}/add`;
  private readonly updateUrl = `${this.API_URL}/update`;
  
  constructor(private http: HttpClient) {}

  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.warehouseUrl);
  }

  deleteWarehouse(id: number): Observable<Warehouse[]> {
    return this.http.delete<Warehouse[]>(`${this.deleteUrl}/${id}`);
  }

  addWarehouse(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.addUrl, warehouse);
  }

  updateWarehouse(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.put<Warehouse>(this.updateUrl, warehouse);
  }

  productAlreadyInWarehouse(warehouseId: number, productId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/check/${warehouseId}/${productId}`);
  }
}
