import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, map, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../auth/auth.service';

interface Permission {
  moduleName: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class PermissionService {

  private permissions = new BehaviorSubject<Permission[]>([]);
  private apiBaseUrl = `${environment.baseUrl}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authService.loading$.pipe(
      filter(loading => !loading),
      take(1)
    ).subscribe(() => {
      this.loadPermissions();
    });

    this.authService.isAuthenticated$
      .pipe(filter(auth => auth === true), take(1))
      .subscribe(() => this.loadPermissions());

    this.authService.loginSuccess$
      .subscribe(() => this.loadPermissions());
  }

  public reloadPermissions(): void {
    this.loadPermissions();
  }

  private loadPermissions(): void {
    this.http.get<any>(`${this.apiBaseUrl}/UserPermission`).pipe(
      catchError(error => {
        console.error('Permission load error:', error);
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      }),
      map(response => response.data)
    ).subscribe(permissions => {
      this.permissions.next(permissions);
    });
  }

  hasPermission$(module: string, action: 'create' | 'update' | 'delete'): Observable<boolean> {
    return this.permissions.pipe(
      filter(perms => perms.length > 0),
      take(1),
      map(userPermissions => {
        const modulePermission = userPermissions.find(p => p.moduleName === module);
        if (!modulePermission) return false;

        switch (action) {
          case 'create': return modulePermission.canCreate;
          case 'update': return modulePermission.canUpdate;
          case 'delete': return modulePermission.canDelete;
          default: return false;
        }
      })
    );
  }

  getPermissions(): Observable<Permission[]> {
    return this.permissions.asObservable();
  }
}
