import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class ContactRequestService {
  
  private apiBaseUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(`${this.apiBaseUrl}/ContactRequests`).pipe(
      map(response => response.data) 
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/ContactRequest?id=${id}`).pipe(
      map(response => response) 
    );
  }
}
