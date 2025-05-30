import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeService } from '../../../services/crud/home/home.service';
import { Router, RouterLink } from '@angular/router';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { PermissionService } from '../../../services/permission/permission.service';

@Component({
  selector: 'app-partners',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent {
  faTrashCan = faTrashCan;
  partners: any[] = [];
  canDelete = false;

  constructor(private homeService: HomeService, private permissionService: PermissionService, private router: Router) {}

  ngOnInit(): void {
    this.getAllPartners();
    this.checkDeletePermission();
  }

  checkDeletePermission(): void {
    this.permissionService.hasPermission$('AboutUs', 'delete').subscribe({
      next: (hasPermission) => {
        this.canDelete = hasPermission;
      },
      error: (err) => {
        console.error('Error checking delete permission:', err);
        this.canDelete = false;
      }
    });
  }

  getAllPartners(): void {
    this.homeService.getAllPartners().subscribe({
      next: (response) => {
        this.partners = response;
      },
      error: (err) => {
        console.error('Error fetching testimonials:', err);
      }
    });
  }

  deletePartner(id: number): void {
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
        this.homeService.deletePartner(id).subscribe({
          next: () => {
            this.partners = this.partners.filter(t => t.id !== id);
            Swal.fire('Deleted!', 'Partner has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting partner:', err);
            Swal.fire('Error!', 'Failed to delete partner.', 'error');
          }
        });
      }
    });
  }
}
