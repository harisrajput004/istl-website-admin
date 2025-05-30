import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCalendar, faClone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { ContactRequestService } from '../../../services/contact/contact.service';

@Component({
  selector: 'app-detail',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class ContactRequestDetailComponent {
  faCalendar = faCalendar;
  faClone = faClone;

  contactRequest: any;

  constructor(private route: ActivatedRoute, private contactService: ContactRequestService) {} 

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.contactService.getById(id).subscribe({
        next: (res) => {
          this.contactRequest = res?.data;
        },
        error: (err) => {
          console.error('Failed to load contact requests:', err);
        }
      });
    }
  }
}
