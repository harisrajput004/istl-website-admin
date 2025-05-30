import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical, faPenToSquare, faTrashCan, faEye } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { ContactRequestService } from '../../services/contact/contact.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact-request',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './contact-request.component.html',
  styleUrl: './contact-request.component.scss'
})
export class ContactRequestComponent {

  faEllipsisVertical = faEllipsisVertical;
  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;
  faEye = faEye;
  
  contactRequests: any[] = [];
  contactId: number | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private contactRequestService: ContactRequestService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.loadContactRequests();
  }

  loadContactRequests(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.contactRequestService.getAll().subscribe({
      next: (response : any[]) => {
        this.contactRequests = response || []; 
        this.isLoading = false;
      },
      error: (error : any) => {
        this.errorMessage = error.message || 'Failed to load contact requests';
        this.isLoading = false;
      }
    });
  }
}