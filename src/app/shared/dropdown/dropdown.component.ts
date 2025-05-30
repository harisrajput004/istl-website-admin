import { Component, Input, HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() options: { label: string, link?: string, action?: () => void }[] = [];
  @Input() icon?: IconDefinition; // Optional, defaults to undefined

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onOptionClick(option: any) {
    if (option.action) {
      option.action(); // Trigger the action function if provided
    }
    this.isOpen = false; // Close the dropdown after clicking
  }

  // Close dropdown on click outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.dropdown-wrapper')) {
      this.isOpen = false;
    }
  }
}
