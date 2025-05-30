import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class CmsService {

  private apiBaseUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient) { }

  getAllPages(): Observable<any[]> {
    return this.http.get<any>(`${this.apiBaseUrl}/Pages`).pipe(
      map(response => response.data)
    );
  }

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

  updateHomeSectionsImages(formData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/Sections/home/images`;
    return this.http.put(url, formData);
  }

  updateServiceSectionsImages(formData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/Sections/service/images`;
    return this.http.put(url, formData);
  }

  updateManagementSectionImage(formData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/Sections/management/image`;
    return this.http.put(url, formData);
  }

  updateAboutSectionsImages(formData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/Sections/about/images`;
    return this.http.put(url, formData);
  }

  updateContactSectionImage(formData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/Sections/contact/image`;
    return this.http.put(url, formData);
  }

  updateVacancySectionImage(formData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/Sections/vacancy/image`;
    return this.http.put(url, formData);
  }

  updatePartnersSectionImage(formData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/Sections/partner/image`;
    return this.http.put(url, formData);
  }

  updateSitemapSectionImage(formData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/Sections/sitemap/image`;
    return this.http.put(url, formData);
  }

  updateSections(pageId: number, sections: any[]): Observable<any> {
    const url = `${this.apiBaseUrl}/Sections`;
    const body = {
      pageId: pageId,
      sections: sections,
    };
    return this.http.put(url, body);
  }

  updateContactPage(id: number, data: any): Observable<any> {
    const url = `${this.apiBaseUrl}/Contact`;
    return this.http.put(url, data);
  }
}
