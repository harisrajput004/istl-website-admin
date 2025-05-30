import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MultiImageUploadComponent } from "../../../shared/multi-image-upload/multi-image-upload.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, MultiImageUploadComponent, RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  handleImages(files: File[]) {
    // console.log('Selected images:', files);
  }  
}
