import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-link-expired',
  imports: [RouterLink],
  templateUrl: './link-expired.component.html',
  styleUrl: './link-expired.component.scss'
})
export class LinkExpiredComponent {
  constructor(private router: Router) { }

  navigateToResetRequest() {
    this.router.navigate(['/forgot-password']);
  }
}
