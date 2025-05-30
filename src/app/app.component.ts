import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet, Event } from '@angular/router';
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { HeaderComponent } from "./shared/header/header.component";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'iris-admin';
  isBrowser = false;
  isLoading = true;
  isRouteLoading = false;

  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  constructor(public router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.isRouteLoading = true;
      }
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.isRouteLoading = false;
        }, 300);
      }
    });
  }



  ngOnInit() {
    this.authService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });

    // if (this.isBrowser) {
    //   this.authService.isAuthenticated$
    //     .pipe(filter(v => v !== null))
    //     .subscribe(isAuthenticated => {
    //       const currentUrl = this.router.url;
    //       if (
    //         !isAuthenticated &&
    //         !this.router.url.includes('/login') &&
    //         !this.router.url.includes('/reset-password') &&
    //         !this.router.url.includes('/forgot-password')
    //       ) {
    //         this.router.navigate(['/login'], {
    //           queryParams: { returnUrl: this.router.url }
    //         });
    //       }
    //     });
    // }
  }
}