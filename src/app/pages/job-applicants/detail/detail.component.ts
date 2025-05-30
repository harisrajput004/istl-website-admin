import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCalendar, faClone } from '@fortawesome/free-solid-svg-icons';
import { JobApplicationService } from '../../../services/job-application/job-application.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  faCalendar = faCalendar;
  faClone = faClone;

  jobApplicant: any;

  constructor(private route: ActivatedRoute, private JobApplicationService: JobApplicationService) {}

  getFileName(url: string): string {
    if (!url) return '';
    return url.split('/').pop() || '';
  }  

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.JobApplicationService.getById(id).subscribe({
        next: (res) => {
          this.jobApplicant = res?.data;
        },
        error: (err) => {
          console.error('Failed to load applicant:', err);
        }
      });
    }
  }
}
