import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class JobApplicationService {
  
  private apiBaseUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}

  getAll(jobId?: number | null, pageNumber?: number | null, pageSize?: number | null): Observable<any[]> {
    let url = `${this.apiBaseUrl}/JobApplications`;
    const params = new URLSearchParams();

    if (jobId != null) {
      params.append('jobId', jobId.toString());
    }
    
    if (pageNumber != null && pageSize != null) {
      params.append('PageNumber', pageNumber.toString());
      params.append('PageSize', pageSize.toString());
    }
    
    const finalUrl = `${url}?${params.toString()}`;
    
    return this.http.get<any>(finalUrl).pipe(
      map(response => response.data)
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/JobApplication?id=${id}`).pipe(
      map(response => response) 
    );
  }

  getDashboardStats(): Observable<any>{
    return this.http.get<any>(`${this.apiBaseUrl}/Dashboards`).pipe(
      map(response => response.data)
    );
  }
}
