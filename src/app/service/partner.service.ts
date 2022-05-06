import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Partner } from '../interface/partner.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor(private http: HttpClient) {}

  public readPartners(): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${environment.apiUrl}/partner/read`);
  }
}
