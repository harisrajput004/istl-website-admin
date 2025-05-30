import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class JobCategoryService {
  
  private apiBaseUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}


  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/JobCategorys`).pipe(
      map(response => response.data)
    );
  }

  add(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/JobCategory`, formData).pipe(
      map(response => response)
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/JobCategory?id=${id}`).pipe(
      map(response => response)
    );
  }

  update(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/JobCategory`, formData).pipe(
      map(response => response)
    );
  }

  deleteByID(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/JobCategory?id=${id}`);
  }
  
}
