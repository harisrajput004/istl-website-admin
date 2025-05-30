import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JobService } from '../../services/job/job.service';
import { FormsModule } from '@angular/forms';
import { PermissionService } from '../../services/permission/permission.service';

@Component({
  selector: 'app-jobs',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent {
  jobs: any[] = [];
  canDelete = false;

  // Color mapping for job categories
  private categoryColors: { [key: string]: string } = {
    'Web Dev': '#EA4C89',
    'UI/UX Developer': '#000000',
    'Backend Developer': '#4285F4',
    'Mobile Developer': '#34A853',
    'DevOps Engineer': '#FBBC05'
  };

  constructor(private jobService: JobService, private permissionService: PermissionService, private router: Router) { }

  ngOnInit(): void {
    this.getAllJobs();
    this.checkDeletePermission();
  }

  checkDeletePermission(): void {
    this.permissionService.hasPermission$('Job', 'delete').subscribe({
      next: (hasPermission) => {
        this.canDelete = hasPermission;
        console.log(this.canDelete);
      },
      error: (err) => {
        console.error('Error checking delete permission:', err);
        this.canDelete = false;
      }
    });
  }

  getAllJobs(): void {
    this.jobService.getAll().subscribe({
      next: (response) => {
        this.jobs = response.map(job => ({
          ...job,
          imageBg: this.getJobColor(job.jobCategoryName),
          statusColor: job.jobStatusId === 1 ? '#0BA02C' : '#E05151',
          daysRemaining: this.getDaysRemaining(job.expiresOn)
        }));
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
      }
    });
  }

  getJobColor(categoryName: string): string {
    return this.categoryColors[categoryName] || '#EA4C89'; // Default color
  }

  getDaysRemaining(expiryDate: string): number {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  toggleJobStatus(job: any): void {
    const newStatus = job.jobStatusId === 1 ? 2 : 1;
    job.jobStatusId = newStatus;
    job.jobStatusName = newStatus === 1 ? 'Active' : 'Inactive';

    this.jobService.updateStatus(job.id, newStatus).subscribe({
      next: (response) => {
        console.log('Status updated successfully');
      },
      error: (err) => {
        console.error('Error updating status:', err);
        const revertStatus = newStatus === 1 ? 2 : 1;
        job.jobStatusId = revertStatus;
        job.jobStatusName = revertStatus === 1 ? 'Active' : 'Inactive';
      }
    });
  }

}
