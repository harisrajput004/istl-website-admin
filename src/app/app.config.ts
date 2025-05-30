import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withPreloading, PreloadAllModules } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './auth/auth.interceptor';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withEnabledBlockingInitialNavigation()),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(QuillModule.forRoot()),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch(),
    ), 
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService]
};
