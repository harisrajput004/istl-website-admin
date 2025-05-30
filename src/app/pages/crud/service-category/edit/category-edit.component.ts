import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from '../../../../shared/single-image-upload/single-image-upload.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HomeService } from '../../../../services/crud/home/home.service';

@Component({
  selector: 'app-category-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent {
  serviceCategoryForm: FormGroup;
  selectedImage: File | null = null;
  hasDeletedImage = false;
  currentImageUrl: string | null = null;
  isSubmitting = false;
  imageRequired = true;
  errorMessage: string | null = null;
  serviceCategoryId: number | null = null;
  showImageRequiredError = false;
  userCancelledImage = false;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.serviceCategoryForm = this.fb.group({
      id: [null],
      serviceCategoryName: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, this.imageRequired ? Validators.required : null]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceCategoryId = +params['id'];
      if (this.serviceCategoryId) {
        this.loadServiceCatgeory(this.serviceCategoryId);
      }
    });
  }

  loadServiceCatgeory(id: number): void {
    this.homeService.getServiceCategoryById(id).subscribe({
      next: (serviceCategory) => {
        this.serviceCategoryForm.patchValue({
          id: serviceCategory.data.id,
          serviceCategoryName: serviceCategory.data.serviceCategoryName,
          description: serviceCategory.data.description,
          image: [null, this.imageRequired ? Validators.required : null]
        });
        this.currentImageUrl = serviceCategory.data.imagePath;

        if (this.currentImageUrl) {
          this.serviceCategoryForm.get('image')?.clearValidators();
        } else {
          this.serviceCategoryForm.get('image')?.setValidators(Validators.required);
        }
        this.serviceCategoryForm.get('image')?.updateValueAndValidity();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load service category';
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
        this.serviceCategoryForm.get('image')?.setValidators(null);
        this.serviceCategoryForm.get('image')?.setErrors(null);
    } else if (this.currentImageUrl) {
        this.showImageRequiredError = false;
        this.serviceCategoryForm.get('image')?.setValidators(null);
        this.serviceCategoryForm.get('image')?.setErrors(null);
    } else {
        this.userCancelledImage = true;
        this.showImageRequiredError = true;
        this.serviceCategoryForm.get('image')?.setValidators(Validators.required);
        this.serviceCategoryForm.get('image')?.setErrors({ required: true });
    }
    
    this.serviceCategoryForm.get('image')?.updateValueAndValidity();
  }


  onSubmit(): void {
    if (this.userCancelledImage) {
        this.showImageRequiredError = true;
        this.serviceCategoryForm.get('image')?.markAsTouched();
        return;
    }

    if (this.serviceCategoryForm.invalid) {
        this.serviceCategoryForm.markAllAsTouched();
        return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('Id', this.serviceCategoryForm.value.id);
    formData.append('ServiceCategoryName', this.serviceCategoryForm.value.serviceCategoryName!);
    formData.append('Description', this.serviceCategoryForm.value.description!);

    if (this.selectedImage) {
        formData.append('Image', this.selectedImage);
    }

    this.homeService.updateServiceCategory(formData).subscribe({
        next: (response: any) => {
            this.isSubmitting = false;
            if (response?.success) {  
                this.router.navigate(['/crud/service-category']);
            } else {
                this.errorMessage = response.message || 'Update completed but with unexpected response';
            }
        },
        error: (error) => {
            console.error('Error updating service category', error);
            this.errorMessage = error.message || 'Failed to update service category';
            this.isSubmitting = false;
        }
    });
  }
}
