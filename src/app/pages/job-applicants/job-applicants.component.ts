import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical, faPenToSquare, faTrashCan, faEye } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { JobApplicationService } from '../../services/job-application/job-application.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-job-applicants',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './job-applicants.component.html',
  styleUrl: './job-applicants.component.scss'
})
export class JobApplicantsComponent {

  faEllipsisVertical = faEllipsisVertical;
  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;
  faEye = faEye;
  
  applicants: any[] = [];
  jobId: number | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private JobApplicationService: JobApplicationService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('jobId') ? + params.get('jobId')! : null;
      this.loadApplicants();
    });
  }

  loadApplicants(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.JobApplicationService.getAll(this.jobId).subscribe({
      next: (response:any) => {
        this.applicants = response || []; 
        this.isLoading = false;
      },
      error: (error:any) => {
        this.errorMessage = error.message || 'Failed to load applicants';
        this.isLoading = false;
      }
    });
  }

  
}
