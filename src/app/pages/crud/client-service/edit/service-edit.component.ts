import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from '../../../../shared/single-image-upload/single-image-upload.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HomeService } from '../../../../services/crud/home/home.service';

@Component({
  selector: 'app-service-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './service-edit.component.html',
  styleUrl: './service-edit.component.scss'
})
export class ServiceEditComponent {
  clientServiceForm: FormGroup;
  serviceCategories: any[] = [];
  selectedImage: File | null = null;
  hasDeletedImage = false;
  currentImageUrl: string | null = null;
  isSubmitting = false;
  imageRequired = true;
  errorMessage: string | null = null;
  serviceId: number | null = null;
  showImageRequiredError = false;
  userCancelledImage = false;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientServiceForm = this.fb.group({
      id: [null],
      serviceName: ['', Validators.required],
      description: ['', Validators.required],
      serviceCategoryId: ['', Validators.required],
      image: [null, this.imageRequired ? Validators.required : null]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = +params['id'];
      if (this.serviceId) {
        this.loadClientService(this.serviceId);
      }
    });

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

  loadClientService(id: number): void {
    this.homeService.getClientServiceById(id).subscribe({
      next: (service) => {
        this.clientServiceForm.patchValue({
          id: service.data.id,
          serviceName: service.data.serviceName,
          description: service.data.description,
          serviceCategoryId: service.data.clientServiceCategoryId,
          image: [null, this.imageRequired ? Validators.required : null]
        });
        this.currentImageUrl = service.data.imagePath;

        if (this.currentImageUrl) {
          this.clientServiceForm.get('image')?.clearValidators();
        } else {
          this.clientServiceForm.get('image')?.setValidators(Validators.required);
        }
        this.clientServiceForm.get('image')?.updateValueAndValidity();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load client service';
        console.error(err);
      }
    });
  }
  

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.hasDeletedImage = !file && !!this.currentImageUrl;
    
    if (file) {
        this.userCancelledImage = false;
        this.currentImageUrl = null;
        this.showImageRequiredError = false;
        this.clientServiceForm.get('image')?.setValidators(null);
        this.clientServiceForm.get('image')?.setErrors(null);
    } else if (this.currentImageUrl) {
        this.showImageRequiredError = false;
        this.clientServiceForm.get('image')?.setValidators(null);
        this.clientServiceForm.get('image')?.setErrors(null);
    } else {
        this.userCancelledImage = true;
        this.showImageRequiredError = true;
        this.clientServiceForm.get('image')?.setValidators(Validators.required);
        this.clientServiceForm.get('image')?.setErrors({ required: true });
    }
    
    this.clientServiceForm.get('image')?.updateValueAndValidity();
  }


  onSubmit(): void {
    if (this.userCancelledImage) {
        this.showImageRequiredError = true;
        this.clientServiceForm.get('image')?.markAsTouched();
        return;
    }

    if (this.clientServiceForm.invalid) {
        this.clientServiceForm.markAllAsTouched();
        return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('Id', this.clientServiceForm.value.id);
    formData.append('ClientServiceCategoryId', this.clientServiceForm.value.serviceCategoryId!);
    formData.append('ServiceName', this.clientServiceForm.value.serviceName!);
    formData.append('Description', this.clientServiceForm.value.description!);

    if (this.selectedImage) {
        formData.append('Image', this.selectedImage);
    }

    this.homeService.updateClientService(formData).subscribe({
        next: (response: any) => {
            this.isSubmitting = false;
            if (response?.success) {  
                this.router.navigate(['/crud/client-service']);
            } else {
                this.errorMessage = response.message || 'Update completed but with unexpected response';
            }
        },
        error: (error) => {
            console.error('Error updating client service', error);
            this.errorMessage = error.message || 'Failed to update client service';
            this.isSubmitting = false;
        }
    });
  }
}
