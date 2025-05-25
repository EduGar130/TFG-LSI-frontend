import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../model/inventory.model';
import { API_URL } from '../../common/constants';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly API_URL = `${API_URL}/inventory`;
  private readonly inventoryUrl = `${this.API_URL}/get`;
  private readonly deleteUrl = `${this.API_URL}/delete`;
  private readonly addUrl = `${this.API_URL}/add`;
  private readonly updateUrl = `${this.API_URL}/update`;
  private readonly exportUrl = `${this.API_URL}/generate-csv`;
  private readonly importUrl = `${this.API_URL}/import-csv`;
  
  constructor(private http: HttpClient) {}

  getInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.inventoryUrl);
  }

  getInventoryByWarehouse(warehouseId: number): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.inventoryUrl}/${warehouseId}`);
  }

  deleteInventory(id: number): Observable<Inventory[]> {
    return this.http.delete<Inventory[]>(`${this.deleteUrl}/${id}`);
  }

  addInventory(inventory: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(this.addUrl, inventory);
  }

  updateInventory(inventory: Inventory): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.updateUrl}/${inventory.id}`, inventory);
  }

  getCsvFile(): Observable<Blob> {
    return this.http.get(this.exportUrl, { responseType: 'blob' });
  }

  importCsv(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.importUrl, formData, {
      responseType: 'text'
    });
  }
}
