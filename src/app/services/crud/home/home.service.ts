import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiBaseUrl = `${environment.baseUrl}`;
  
    constructor(private http: HttpClient) { }
  
    getSectionsByPageId(pageId: number): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/Sections?pageId=${pageId}`).pipe(
        map(response => response.data)
      );
    }
  
    updateHomeSections(pageId: number, sections: any[]): Observable<any> {
      const url = `${this.apiBaseUrl}/Sections/home`;
      const body = {
        pageId: pageId,
        sections: sections,
      };
      return this.http.put(url, body);
    }
  
    updateSections(pageId: number, sections: any[]): Observable<any> {
      const url = `${this.apiBaseUrl}/Sections`;
      const body = {
        pageId: pageId,
        sections: sections,
      };
      return this.http.put(url, body);
    }

    getAllHomeTestimonials(): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/Testimonials`).pipe(
        map(response => response.data)
      );
    }

    addTestimonial(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiBaseUrl}/Testimonial`, formData).pipe(
        map(response => response)
      );
    }

    getTestimonialById(id: number): Observable<any> {
      return this.http.get(`${this.apiBaseUrl}/Testimonial?id=${id}`).pipe(
        map(response => response)
      );
    }

    updateTestimonial(formData: FormData): Observable<any> {
      return this.http.put(`${this.apiBaseUrl}/Testimonial`, formData).pipe(
        map(response => response)
      );
    }

    getAllPartners(): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/Partners`).pipe(
        map(response => response.data)
      );
    }

    addPartner(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiBaseUrl}/Partner`, formData).pipe(
        map(response => response)
      );
    }

    getPartnerById(id: number): Observable<any> {
      return this.http.get(`${this.apiBaseUrl}/Partner?id=${id}`).pipe(
        map(response => response)
      );
    }

    updatePartner(formData: FormData): Observable<any> {
      return this.http.put(`${this.apiBaseUrl}/Partner`, formData).pipe(
        map(response => response)
      );
    }

    getAllClients(): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/Clients`).pipe(
        map(response => response.data)
      );
    }

    addClient(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiBaseUrl}/Client`, formData).pipe(
        map(response => response)
      );
    }

    getClientById(id: number): Observable<any> {
      return this.http.get(`${this.apiBaseUrl}/Client?id=${id}`).pipe(
        map(response => response)
      );
    }

    updateClient(formData: FormData): Observable<any> {
      return this.http.put(`${this.apiBaseUrl}/Client`, formData).pipe(
        map(response => response)
      );
    }

    getAllTeamMembers(): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/TeamMembers`).pipe(
        map(response => response.data)
      );
    }

    addTeamMember(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiBaseUrl}/TeamMember`, formData).pipe(
        map(response => response)
      );
    }

    getTeamMemberById(id: number): Observable<any> {
      return this.http.get(`${this.apiBaseUrl}/TeamMember?id=${id}`).pipe(
        map(response => response)
      );
    }

    updateTeamMember(formData: FormData): Observable<any> {
      return this.http.put(`${this.apiBaseUrl}/TeamMember`, formData).pipe(
        map(response => response)
      );
    }

    getAllServiceCategories(): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/ClientServiceCategorys`).pipe(
        map(response => response.data)
      );
    }

    addServiceCategory(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiBaseUrl}/ClientServiceCategory`, formData).pipe(
        map(response => response)
      );
    }

    getServiceCategoryById(id: number): Observable<any> {
      return this.http.get(`${this.apiBaseUrl}/ClientServiceCategory?id=${id}`).pipe(
        map(response => response)
      );
    }

    updateServiceCategory(formData: FormData): Observable<any> {
      return this.http.put(`${this.apiBaseUrl}/ClientServiceCategory`, formData).pipe(
        map(response => response)
      );
    }

    getAllClientServices(): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/ClientServices`).pipe(
        map(response => response.data)
      );
    }

    addClientService(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiBaseUrl}/ClientService`, formData).pipe(
        map(response => response)
      );
    }

    getClientServiceById(id: number): Observable<any> {
      return this.http.get(`${this.apiBaseUrl}/ClientService?id=${id}`).pipe(
        map(response => response)
      );
    }

    updateClientService(formData: FormData): Observable<any> {
      return this.http.put(`${this.apiBaseUrl}/ClientService`, formData).pipe(
        map(response => response)
      );
    }

    updateAdminProfile(formData: FormData): Observable<any> {
      return this.http.put(`${this.apiBaseUrl}/User`, formData).pipe(
        map(response => response)
      );
    }

    deleteHomeTestimonial(id: number): Observable<any>{
      return this.http.delete(`${this.apiBaseUrl}/Testimonial?id=${id}`).pipe(
      );
    }

    deletePartner(id: number): Observable<any>{
      return this.http.delete(`${this.apiBaseUrl}/Partner?id=${id}`).pipe(
      );
    }

    deleteClient(id: number): Observable<any>{
      return this.http.delete(`${this.apiBaseUrl}/Client?id=${id}`).pipe(
      );
    }

    deleteTeamMember(id: number): Observable<any>{
      return this.http.delete(`${this.apiBaseUrl}/TeamMember?id=${id}`).pipe(
      );
    }

    deleteClientServiceCategory(id: number): Observable<any>{
      return this.http.delete(`${this.apiBaseUrl}/ClientServiceCategory?id=${id}`).pipe(
      );
    }

    deleteClientService(id: number): Observable<any>{
      return this.http.delete(`${this.apiBaseUrl}/ClientService?id=${id}`).pipe(
      );
    }
}

