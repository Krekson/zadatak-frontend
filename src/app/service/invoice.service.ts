import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Invoice } from '../interface/invoice.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) {}

  public createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${environment.apiUrl}/invoice/create`, invoice);
  }

  public readInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${environment.apiUrl}/invoice/read`);
  }

  public readInvoice(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${environment.apiUrl}/invoice/read/${id}`);
  }

  public updateInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${environment.apiUrl}/invoice/update`, invoice);
  }

  public deleteInvoice(id: number) {
    return this.http.delete<void>(`${environment.apiUrl}/invoice/delete/${id}`);
  }
}
