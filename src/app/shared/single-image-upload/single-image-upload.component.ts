import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-single-image-upload',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './single-image-upload.component.html',
  styleUrl: './single-image-upload.component.scss'
})
export class SingleImageUploadComponent implements OnChanges {

  fileInputId = `fileInput-${Math.random().toString(36).substr(2, 9)}`;

  @Input() initialUrl: string | null = null;

  @Input() isInvalid = false;
  @Output() imageSelected = new EventEmitter<File | null>();

  image: { file: File | null; url: string | null } = { file: null, url: null };
  faXmark = faXmark;

  ngOnChanges(changes: SimpleChanges) {
    const initChange = changes['initialUrl'];
    if (initChange && this.initialUrl) {
      this.image = { file: null, url: this.initialUrl };
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.image = { file, url: e.target?.result as string };
        this.emitImage();
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.image = { file: null, url: null };
    this.emitImage();
  }

  emitImage() {
    this.imageSelected.emit(this.image.file);
  }
}
