import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { PermissionService } from '../services/permission/permission.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UnauthorizedPopupComponent } from '../shared/unauthorized-popup/unauthorized-popup.component';


export const PermissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const permissionService = inject(PermissionService);
  const dialog = inject(MatDialog);

  const requiredPermission = route.data['permission'];

  if (!requiredPermission) {
    return true;
  }

  return permissionService.hasPermission$(requiredPermission.module, requiredPermission.action).pipe(
    map(hasPermission => {
      if (!hasPermission) {
        showUnauthorizedPopup(dialog);
        return false;
      }
      return true;
    }),
    catchError(() => {
      showUnauthorizedPopup(dialog);
      return of(false);
    })
  );

  function showUnauthorizedPopup(dialog: MatDialog) {
    dialog.open(UnauthorizedPopupComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Access Denied',
        message: 'You are not authorized to access this page.'
      }
    });
  }
};