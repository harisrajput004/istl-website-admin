import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeService } from '../../../services/crud/home/home.service';
import { Router, RouterLink } from '@angular/router';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { PermissionService } from '../../../services/permission/permission.service';

@Component({
  selector: 'app-service-category',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './service-category.component.html',
  styleUrl: './service-category.component.scss'
})
export class ServiceCategoryComponent {
  faTrashCan = faTrashCan;
  serviceCategories: any[] = [];
  canDelete = false;

  constructor(private homeService: HomeService, private permissionService: PermissionService, private router: Router) {}

  ngOnInit(): void {
    this.getAllServiceCategories();
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

  getAllServiceCategories(): void {
    this.homeService.getAllServiceCategories().subscribe({
      next: (response) => {
        this.serviceCategories = response;
      },
      error: (err) => {
        console.error('Error fetching service categories:', err);
      }
    });
  }

  deleteClientServiceCategory(id: number): void {
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
        this.homeService.deleteClientServiceCategory(id).subscribe({
          next: () => {
            this.serviceCategories = this.serviceCategories.filter(t => t.id !== id);
            Swal.fire('Deleted!', 'Service Category has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting service category:', err);
            Swal.fire('Error!', 'Failed to delete service category.', 'error');
          }
        });
      }
    });
  }
}
