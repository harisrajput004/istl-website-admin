import { Component } from '@angular/core';
import { HomeService } from '../../../services/crud/home/home.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { PermissionService } from '../../../services/permission/permission.service';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  faTrashCan = faTrashCan;
  clients: any[] = [];
  canDelete = false;

  constructor(private homeService: HomeService, private permissionService: PermissionService, private router: Router) {}

  ngOnInit(): void {
    this.getAllClients();
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

  getAllClients(): void {
    this.homeService.getAllClients().subscribe({
      next: (response) => {
        this.clients = response;
      },
      error: (err) => {
        console.error('Error fetching testimonials:', err);
      }
    });
  }

  deleteClient(id: number): void {
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
        this.homeService.deleteClient(id).subscribe({
          next: () => {
            this.clients = this.clients.filter(t => t.id !== id);
            Swal.fire('Deleted!', 'Client has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting client:', err);
            Swal.fire('Error!', 'Failed to delete client.', 'error');
          }
        });
      }
    });
  }
}
