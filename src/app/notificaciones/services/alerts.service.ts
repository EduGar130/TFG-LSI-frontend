// src/app/services/transaction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alert } from '../model/alert.model';
import { API_URL } from '../../common/constants';


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly API_URL = `${API_URL}/inventory-alerts`;
  private readonly alertUrl = `${this.API_URL}/get`;
  private readonly deleteUrl = `${this.API_URL}/delete`;
  private readonly addUrl = `${this.API_URL}/add`;
  private readonly updateUrl = `${this.API_URL}/update`;
  
  constructor(private http: HttpClient) {}

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(this.alertUrl);
  }

  deleteTransaction(id: number): Observable<Alert[]> {
    return this.http.delete<Alert[]>(`${this.deleteUrl}/${id}`);
  }

  addTransaction(alert: Alert): Observable<Alert> {
    return this.http.post<Alert>(this.addUrl, alert);
  }

  updateTransaction(alert: Alert): Observable<Alert> {
    return this.http.put<Alert>(this.updateUrl, alert);
  }
}
