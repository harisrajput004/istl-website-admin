import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

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

}
