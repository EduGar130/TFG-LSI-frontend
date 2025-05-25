import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../common/constants';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly baseUrl = `${API_URL}/reports`;

  constructor(private http: HttpClient) {}

  generarEstadisticasPDF(sku?: string) {
    const params: any = sku ? { sku } : {};
    return this.http.get(`${this.baseUrl}/estadisticas/pdf`, {
      params,
      responseType: 'blob'
    });
  }
}