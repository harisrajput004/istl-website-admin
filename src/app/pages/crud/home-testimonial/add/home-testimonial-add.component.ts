import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from "../../../../shared/single-image-upload/single-image-upload.component";
import { HomeService } from '../../../../services/crud/home/home.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-testimonial-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './home-testimonial-add.component.html',
  styleUrl: './home-testimonial-add.component.scss'
})
export class HomeTestimonialAddComponent {
  testimonialForm: FormGroup; 
  selectedImage: File | null = null;
  isSubmitting = false;
  imageRequired = true; 
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router
  ) {
    this.testimonialForm = this.fb.group({
      clientName: ['', Validators.required],
      comment: ['', Validators.required],
      clientOccupation: ['', Validators.required],
      image: [null, this.imageRequired ? Validators.required : null]
    });
  }

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.testimonialForm.get('image')?.setValue(file ? 'valid' : null);
    this.testimonialForm.get('image')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.imageRequired && !this.selectedImage) {
      this.testimonialForm.get('image')?.setErrors({ required: true });
    }

    if (this.testimonialForm.invalid) {
      console.log('Form errors:', this.testimonialForm.errors);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('ClientName', this.testimonialForm.value.clientName!);
    formData.append('Comment', this.testimonialForm.value.comment!);
    formData.append('ClientOccupation', this.testimonialForm.value.clientOccupation!);
    
    if (this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    this.homeService.addTestimonial(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.testimonialForm.reset();
        this.selectedImage = null;
        this.isSubmitting = false;
        this.router.navigate(['/crud/home-testimonial']);
      },
      error: (error) => {
        console.error('Error adding testimonial', error);
        this.errorMessage = error.message || 'Failed to add testimonial';
        this.isSubmitting = false;
      }
    });
  }
}
