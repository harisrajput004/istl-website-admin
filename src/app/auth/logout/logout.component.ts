import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.performLogout();
  }

  private performLogout(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.authService.logout();
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        this.router.navigate(['/login']);
      }
    } 
  }
}
