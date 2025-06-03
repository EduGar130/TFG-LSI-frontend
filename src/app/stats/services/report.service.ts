import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../common/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly baseUrl = `${API_URL}/reports`;

  constructor(private http: HttpClient) {}

  generarEstadisticasPDF(sku?: string, 
                        almacenSeleccionado?: number | string, 
                        categoriaSeleccionada?: number | string, 
                        fechaInicio?: string, 
                        fechaFin?: string
                      ): Observable<Blob> {
    const params: any = {};
    if (sku) {
      params.sku = sku;
    }
    if (almacenSeleccionado) {
      params.almacen = almacenSeleccionado;
    }
    if (categoriaSeleccionada) {
      params.categoria = categoriaSeleccionada;
    }
    if (fechaInicio) {
      params.fechaInicio = fechaInicio;
    }
    if (fechaFin) {
      params.fechaFin = fechaFin;
    }
    return this.http.get(`${this.baseUrl}/estadisticas/pdf`, {
      params,
      responseType: 'blob'
    });
  }
}