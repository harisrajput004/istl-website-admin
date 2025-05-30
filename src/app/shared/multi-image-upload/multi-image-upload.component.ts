import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-multi-image-upload',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './multi-image-upload.component.html',
  styleUrl: './multi-image-upload.component.scss'
})
export class MultiImageUploadComponent {
  faXmark = faXmark;
  images: { file: File, url: string }[] = [];

  @Output() imagesSelected = new EventEmitter<File[]>();

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.images.push({ file, url: e.target?.result as string });
          if (this.images.length === input.files?.length) {
            this.emitImages();
          }
        };

        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
    this.emitImages();
  }

  emitImages() {
    this.imagesSelected.emit(this.images.map(img => img.file));
  }
}
