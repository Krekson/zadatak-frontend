import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from '../interface/item.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) {}

  public readItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${environment.apiUrl}/item/read`);
  }

  public readItem(id: number): Observable<Item> {
    return this.http.get<Item>(`${environment.apiUrl}/item/read/${id}`);
  }

  public findItem(name: string): Observable<Item> {
    return this.http.get<Item>(`${environment.apiUrl}/item/find/${name}`);
  }
}
