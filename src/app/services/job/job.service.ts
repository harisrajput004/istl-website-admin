import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class JobService {
  
  private apiBaseUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(`${this.apiBaseUrl}/Jobs`).pipe(
      map(response => response.data) 
    );
  }

  getAllTags(): Observable<any[]> {
    return this.http.get<any>(`${this.apiBaseUrl}/Tags`).pipe(
      map(response => response.data) 
    );
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any>(`${this.apiBaseUrl}/JobCategorys`).pipe(
      map(response => response.data) 
    );
  }

  getJobsFiltered(keyword: string, categoryId: number) {
    return this.http.get<any[]>(`/api/jobs`, {
      params: {
        keyword,
        categoryId
      }
    });
  }

  createJob(formData: FormData): Observable<any> {
    console.log(formData)
    return this.http.post(`${this.apiBaseUrl}/Job`, formData).pipe(
      map(response => response)
    );
  }

  updateStatus(jobId: number, jobStatusId: number): Observable<any> {
    const requestBody = {
      jobId: jobId,
      jobStatusId: jobStatusId
    };
    return this.http.put(`${this.apiBaseUrl}/Job/status`, requestBody).pipe(
      map(response => response)
    );
  }
  
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/Job`, {
      params: { id }
    });
  }
  

  update(jobData: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/Job`, jobData).pipe(
      map(response => response)
    );
  }
  
}
