import { Component, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  @Output() confirmed = new EventEmitter<boolean>();
  showModal = true;

  confirm() {
    this.confirmed.emit(true);
    this.showModal = false;
  }

  closeModal() {
    this.confirmed.emit(false);
    this.showModal = false;
  }

}
