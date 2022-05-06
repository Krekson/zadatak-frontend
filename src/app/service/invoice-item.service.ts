import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InvoiceItem } from '../interface/invoice-item.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceItemService {

  constructor(private http: HttpClient) {}

  public createInvoiceItem(invoiceItem: InvoiceItem): Observable<InvoiceItem> {
    return this.http.post<InvoiceItem>(`${environment.apiUrl}/invoice_item/create`, invoiceItem);
  }

  public readInvoiceItems(invoiceId: number): Observable<InvoiceItem[]> {
    return this.http.get<InvoiceItem[]>(`${environment.apiUrl}/invoice_item/read/${invoiceId}`);
  }

  public deleteInvoiceItem(id: number) {
    return this.http.delete<void>(`${environment.apiUrl}/invoice_item/delete/${id}`);
  }

  public deleteAllInvoiceItems(invoiceId: number) {
    return this.http.delete<void>(`${environment.apiUrl}/invoice_item/deleteAll/${invoiceId}`);
  }
}
