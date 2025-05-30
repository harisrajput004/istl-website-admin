import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  const publicRoutes = ['/login', '/forgot-password', '/logout', '/reset-password', '/link-expired'];
  if (publicRoutes.some(path => state.url.includes(path))) {
    return true;
  }

  // Skip auth check for logout route
  if (state.url.includes('/logout')) {
    return true;
  }

  // On server, allow navigation (will be rechecked on client)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Wait for auth initialization
  await firstValueFrom(authService.loading$.pipe(
    filter(loading => !loading),
    take(1)
  ));



  // Check authentication status
  if (authService.isAuthenticated) {
    return true;
  }

  // Redirect to login with return URL
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};