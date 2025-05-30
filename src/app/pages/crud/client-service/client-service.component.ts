import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeService } from '../../../services/crud/home/home.service';
import { Router, RouterLink } from '@angular/router';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { PermissionService } from '../../../services/permission/permission.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-client-service',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './client-service.component.html',
  styleUrl: './client-service.component.scss'
})

export class ClientServiceComponent {
  faTrashCan = faTrashCan;
  clientServices: any[] = [];
  canDelete = false;

  constructor(private homeService: HomeService, private permissionService: PermissionService, private router: Router) {
  }

  ngOnInit(): void {
    this.getAllClientServices();
    this.checkDeletePermission();
  }

  checkDeletePermission(): void {
    this.permissionService.hasPermission$('Services', 'delete').subscribe({
      next: (hasPermission) => {
        this.canDelete = hasPermission;
      },
      error: (err) => {
        console.error('Error checking delete permission:', err);
        this.canDelete = false;
      }
    });
  }

  getAllClientServices(): void {
    this.homeService.getAllClientServices().subscribe({
      next: (response) => {
        this.clientServices = response;
      },
      error: (err) => {
        console.error('Error fetching services:', err);
      }
    });
  }

  deleteClientService(id: number): void {
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
        this.homeService.deleteClientService(id).subscribe({
          next: () => {
            this.clientServices = this.clientServices.filter(t => t.id !== id);
            Swal.fire('Deleted!', 'Client service has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting client service:', err);
            Swal.fire('Error!', 'Failed to delete client service.', 'error');
          }
        });
      }
    });
  }
}
