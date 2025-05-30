import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeService } from '../../../services/crud/home/home.service';
import { Router, RouterLink } from '@angular/router';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { PermissionService } from '../../../services/permission/permission.service';

@Component({
  selector: 'app-home-testimonial',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './home-testimonial.component.html',
  styleUrl: './home-testimonial.component.scss'
})
export class HomeTestimonialComponent {
  faTrashCan = faTrashCan;
  testimonials: any[] = [];
  canDelete = false;

  constructor(private homeService: HomeService, private permissionService: PermissionService, private router: Router) {}

  ngOnInit(): void {
    this.getTestimonials();
    this.checkDeletePermission();
  }

  checkDeletePermission(): void {
    this.permissionService.hasPermission$('Home', 'delete').subscribe({
      next: (hasPermission) => {
        this.canDelete = hasPermission;
      },
      error: (err) => {
        console.error('Error checking delete permission:', err);
        this.canDelete = false;
      }
    });
  }

  getTestimonials(): void {
    this.homeService.getAllHomeTestimonials().subscribe({
      next: (response) => {
        this.testimonials = response;
      },
      error: (err) => {
        console.error('Error fetching testimonials:', err);
      }
    });
  }

  deleteTestimonial(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.homeService.deleteHomeTestimonial(id).subscribe({
          next: () => {
            this.testimonials = this.testimonials.filter(t => t.id !== id);
            Swal.fire('Deleted!', 'Testimonial has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting testimonial:', err);
            Swal.fire('Error!', 'Failed to delete testimonial.', 'error');
          }
        });
      }
    });
  }
}
