import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-job-select',
  imports: [CommonModule, FormsModule,  FontAwesomeModule],
  templateUrl: './create-job-select.component.html',
  styleUrl: './create-job-select.component.scss'
})
export class CreateJobSelectComponent {
  @Input() options: { label: string, value: string }[] = [];
  selectedValue: string = '';

  faChevronDown = faChevronDown;
}
