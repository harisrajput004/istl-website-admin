import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  
  private apiBaseUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(`${this.apiBaseUrl}/Notifications`).pipe(
      map(response => response.data) 
    );
  }

}
