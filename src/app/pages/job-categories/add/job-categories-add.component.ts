import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from "../../../shared/single-image-upload/single-image-upload.component";
import { JobCategoryService } from '../../../services/job-category/job-category.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-job-categories-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './job-categories-add.component.html',
  styleUrl: './job-categories-add.component.scss'
})
export class JobCategoriesAddComponent {
  jobCategoryForm: FormGroup; 
  selectedImage: File | null = null;
  isSubmitting = false;
  imageRequired = true; 
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private jobCategoryService: JobCategoryService,
    private router: Router
  ) {
    this.jobCategoryForm = this.fb.group({
      name: ['', Validators.required],
      url: [''],
      image: [null, this.imageRequired ? Validators.required : null]
    });
  }

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.jobCategoryForm.get('image')?.setValue(file ? 'valid' : null);
    this.jobCategoryForm.get('image')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.imageRequired && !this.selectedImage) {
      this.jobCategoryForm.get('image')?.setErrors({ required: true });
    }

    if (this.jobCategoryForm.invalid) {
      console.log('Form errors:', this.jobCategoryForm.errors);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('JobCategoryName', this.jobCategoryForm.value.name!);
    
    if (this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    this.jobCategoryService.add(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.jobCategoryForm.reset();
        this.selectedImage = null;
        this.isSubmitting = false;
        this.router.navigate(['/job-categories']);
      },
      error: (error) => {
        console.error('Error adding client', error);
        this.errorMessage = error.message || 'Failed to add client';
        this.isSubmitting = false;
      }
    });
  }
}
