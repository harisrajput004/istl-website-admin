import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { LinkExpiredComponent } from './auth/link-expired/link-expired.component';

export const routes: Routes = [
    
    { path: '', loadChildren: () => import('./pages/pages.routes').then(m => m.PAGES_ROUTES), canActivate: [authGuard], data: { preload: true } },
    { path: 'logout', component: LogoutComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'link-expired', component: LinkExpiredComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'dashboard' }
];

