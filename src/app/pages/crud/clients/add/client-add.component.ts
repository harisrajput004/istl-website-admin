import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from "../../../../shared/single-image-upload/single-image-upload.component";
import { HomeService } from '../../../../services/crud/home/home.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './client-add.component.html',
  styleUrl: './client-add.component.scss'
})
export class ClientAddComponent {
  clientForm: FormGroup;
  selectedImage: File | null = null;
  isSubmitting = false;
  imageRequired = true;
  errorMessage: string | null = null;


  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', {
        validators: [this.noNumbersValidator],
        updateOn: 'change'
      }],
      image: [null, this.imageRequired ? Validators.required : null]
    });
  }

  noNumbersValidator(control: any) {
    const hasNumbers = /\d/.test(control.value);
    return hasNumbers ? { containsNumbers: true } : null;
  }

  onUrlInput() {
    const urlControl = this.clientForm.get('url');
    urlControl?.markAsTouched();  
  }

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.clientForm.get('image')?.setValue(file ? 'valid' : null);
    this.clientForm.get('image')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.imageRequired && !this.selectedImage) {
      this.clientForm.get('image')?.setErrors({ required: true });
    }

    if (this.clientForm.invalid) {
      console.log('Form errors:', this.clientForm.errors);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('name', this.clientForm.value.name!);
    formData.append('url', this.clientForm.value.url!);

    if (this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    this.homeService.addClient(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.clientForm.reset();
        this.selectedImage = null;
        this.isSubmitting = false;
        this.router.navigate(['/crud/client']);
      },
      error: (error) => {
        console.error('Error adding client', error);
        this.errorMessage = error.message || 'Failed to add client';
        this.isSubmitting = false;
      }
    });
  }
}
