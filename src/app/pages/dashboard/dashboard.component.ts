import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowTrendUp, faEllipsisVertical, faPenToSquare, faTrashCan, faEye } from '@fortawesome/free-solid-svg-icons';
import { JobApplicationService } from '../../services/job-application/job-application.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification/notification.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  isInitialLoad = true;
  showDashboard = false;

  totalJobs: number = 0;
  appliedJobs: number = 0;
  totalVisitors: number = 0;

  faArrowTrendUp = faArrowTrendUp;
  faEllipsisVertical = faEllipsisVertical;
  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;
  faEye = faEye;

  applicants: any[] = [];
  notifications: any[] = [];
  jobId: number | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  dropdownOptions = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Jobs', link: '/jobs' },
    { label: 'Package', link: '/package' },
    { label: 'Transactions', link: '/transactions' }];

  constructor(
    private jobApplicationService: JobApplicationService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkCurrentRoute();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkCurrentRoute();
    });

    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('jobId') ? +params.get('jobId')! : null;
      this.loadApplicants();
    });

    this.loadNotifications();
    this.loadDashboardStats();

    setTimeout(() => {
      if (this.isInitialLoad) {
        this.isInitialLoad = false;
        this.checkCurrentRoute();
      }
    }, 1000);
  }

  private checkCurrentRoute(): void {
    this.showDashboard = this.router.url === '/dashboard';
    this.isInitialLoad = false;
  }

  loadApplicants(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.jobApplicationService.getAll(this.jobId, 1, 10).subscribe({
      next: (response) => {
        this.applicants = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load applicants';
      }
    });
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.notificationService.getAll().subscribe({
      next: (response) => {
        this.notifications = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load notifications';
      }
    });
  }

  loadDashboardStats(): void {
    this.jobApplicationService.getDashboardStats().subscribe({
      next: (data: any) => {
        this.totalJobs = data.totalJobs;
        this.appliedJobs = data.appliedJobs;
        this.totalVisitors = data.totalVisitors;
      },
      error: () => {
        console.error('Failed to load dashboard stats');
      }
    });
  }

  getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);

    date.setHours(date.getHours() + 5);

    const diffMs = now.getTime() - date.getTime();

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

}
