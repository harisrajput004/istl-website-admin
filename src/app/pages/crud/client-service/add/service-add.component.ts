import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from "../../../../shared/single-image-upload/single-image-upload.component";
import { HomeService } from '../../../../services/crud/home/home.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './service-add.component.html',
  styleUrl: './service-add.component.scss'
})
export class ServiceAddComponent {
  clientServiceForm: FormGroup; 
  selectedImage: File | null = null;
  isSubmitting = false;
  imageRequired = true; 
  errorMessage: string | null = null;
  serviceCategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router
  ) {
    this.clientServiceForm = this.fb.group({
      serviceName: ['', Validators.required],
      description: ['', Validators.required],
      serviceCategoryId: ['', Validators.required],
      image: [null, this.imageRequired ? Validators.required : null]
    });
  }

  ngOnInit(): void {
    this.getAllServiceCategories();
  }

  getAllServiceCategories(): void {
    this.homeService.getAllServiceCategories().subscribe({
      next: (response) => {
        this.serviceCategories = response;
      },
      error: (err) => {
        console.error('Error fetching service categories:', err);
      }
    });
  }

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.clientServiceForm.get('image')?.setValue(file ? 'valid' : null);
    this.clientServiceForm.get('image')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.imageRequired && !this.selectedImage) {
      this.clientServiceForm.get('image')?.setErrors({ required: true });
    }

    if (this.clientServiceForm.invalid) {
      console.log('Form errors:', this.clientServiceForm.errors);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('ServiceName', this.clientServiceForm.value.serviceName!);
    formData.append('ClientServiceCategoryId', this.clientServiceForm.value.serviceCategoryId);
    formData.append('Description', this.clientServiceForm.value.description!);
    
    if (this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    this.homeService.addClientService(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.clientServiceForm.reset();
        this.selectedImage = null;
        this.isSubmitting = false;
        this.router.navigate(['/crud/client-service']);
      },
      error: (error) => {
        console.error('Error adding client service', error);
        this.errorMessage = error.message || 'Failed to add client service';
        this.isSubmitting = false;
      }
    });
  }
}
