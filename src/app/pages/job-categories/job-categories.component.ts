import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { JobCategoryService } from '../../services/job-category/job-category.service';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { PermissionService } from '../../services/permission/permission.service';

interface JobCategory {
  id: number;
  jobCategoryName: string;
  imagePath?: string;
}

@Component({
  selector: 'app-jobs',
  imports: [CommonModule, FormsModule, RouterLink, ConfirmationModalComponent],
  templateUrl: './job-categories.component.html',
  styleUrl: './job-categories.component.scss'
})

export class JobCategoriesComponent {
  jobCategories: JobCategory[] = [];
  showConfirmationModal = false;
  categoryToDelete: number | null = null;
  canDelete = false;

  constructor(private jobCategoryService: JobCategoryService, private permissionService: PermissionService, private router: Router) {}

  ngOnInit(): void {
    this.getAllJobCategories();
    this.checkDeletePermission();
  }

  checkDeletePermission(): void {
    this.permissionService.hasPermission$('Job', 'delete').subscribe({
      next: (hasPermission) => {
        this.canDelete = hasPermission;
      },
      error: (err) => {
        console.error('Error checking delete permission:', err);
        this.canDelete = false;
      }
    });
  }

  getAllJobCategories(): void {
    this.jobCategoryService.getAll().subscribe({
      next: (response: JobCategory[]) => { 
        this.jobCategories = response.map((category: JobCategory) => ({
          ...category,
        }));
      },
      error: (err) => {
        console.error('Error fetching job categories:', err);
      }
    });
  }

  openDeleteConfirmation(id: number): void {
    this.categoryToDelete = id;
    this.showConfirmationModal = true;
  }

  handleConfirmation(confirmed: boolean): void {
    this.showConfirmationModal = false;
    
    if (confirmed && this.categoryToDelete) {
      this.jobCategoryService.deleteByID(this.categoryToDelete).subscribe({
        next: () => {
          this.jobCategories = this.jobCategories.filter(category => category.id !== this.categoryToDelete);
          this.categoryToDelete = null;
          this.router.navigate(['/job-categories']);
        },
        error: (err) => {
          console.error('Error deleting job category:', err);
          this.categoryToDelete = null;
        }
      });
    } else {
      this.categoryToDelete = null;
    }
  } 

}
