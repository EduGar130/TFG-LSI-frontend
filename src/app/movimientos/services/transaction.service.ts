// src/app/services/transaction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Transaction } from '../model/transaction.model';
import { API_URL } from '../../common/constants';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly API_URL = `${API_URL}/transactions`;
  private readonly transactionUrl = `${this.API_URL}/get`;
  private readonly deleteUrl = `${this.API_URL}/delete`;
  private readonly addUrl = `${this.API_URL}/add`;
  private readonly updateUrl = `${this.API_URL}/update`;

  private transactionsChangedSubject = new Subject<void>();
  transactionsChanged$ = this.transactionsChangedSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.transactionUrl);
  }

  deleteTransaction(id: number): Observable<Transaction[]> {
    return this.http.delete<Transaction[]>(`${this.deleteUrl}/${id}`);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.addUrl, transaction);
  }

  updateTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(this.updateUrl, transaction);
  }

  notifyTransactionsChanged(): void {
    this.transactionsChangedSubject.next();
  }
}
