import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  
  private apiBaseUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/User?id=${id}`).pipe(
      map(response => response) 
    );
  }

  update(id: number, data: any): Observable<any> {
    const url = `${this.apiBaseUrl}/Contact`;
    return this.http.put(url, data);
  }

  updateProfile(firstName: any, lastName: any): Observable<any> {
    const url = `${this.apiBaseUrl}/User?FirstName=${encodeURIComponent(firstName)}&LastName=${encodeURIComponent(lastName)}`;
    return this.http.put(url, null);
  }
}
