import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from "../../../../shared/single-image-upload/single-image-upload.component";
import { HomeService } from '../../../../services/crud/home/home.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './category-add.component.html',
  styleUrl: './category-add.component.scss'
})
export class CategoryAddComponent {
  serviceCategoryForm: FormGroup; 
  selectedImage: File | null = null;
  isSubmitting = false;
  imageRequired = true; 
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router
  ) {
    this.serviceCategoryForm = this.fb.group({
      serviceCategoryName: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, this.imageRequired ? Validators.required : null]
    });
  }

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.serviceCategoryForm.get('image')?.setValue(file ? 'valid' : null);
    this.serviceCategoryForm.get('image')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.imageRequired && !this.selectedImage) {
      this.serviceCategoryForm.get('image')?.setErrors({ required: true });
    }

    if (this.serviceCategoryForm.invalid) {
      console.log('Form errors:', this.serviceCategoryForm.errors);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('ServiceCategoryName', this.serviceCategoryForm.value.serviceCategoryName!);
    formData.append('Description', this.serviceCategoryForm.value.description!);
    
    if (this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    this.homeService.addServiceCategory(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.serviceCategoryForm.reset();
        this.selectedImage = null;
        this.isSubmitting = false;
        this.router.navigate(['/crud/service-category']);
      },
      error: (error) => {
        console.error('Error adding service category', error);
        this.errorMessage = error.message || 'Failed to add service category';
        this.isSubmitting = false;
      }
    });
  }
}
