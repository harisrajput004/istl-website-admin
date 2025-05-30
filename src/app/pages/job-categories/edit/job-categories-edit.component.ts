import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from '../../../shared/single-image-upload/single-image-upload.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HomeService } from '../../../services/crud/home/home.service';
import { JobCategoryService } from '../../../services/job-category/job-category.service';

@Component({
  selector: 'app-client-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './job-categories-edit.component.html',
  styleUrl: './job-categories-edit.component.scss'
})
export class JobCategoriesEditComponent {
  jobCategoryForm: FormGroup;
  selectedImage: File | null = null;
  hasDeletedImage = false;
  currentImageUrl: string | null = null;
  isSubmitting = false;
  imageRequired = true;
  errorMessage: string | null = null;
  clientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private jobCategoryService: JobCategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.jobCategoryForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      image: [null, this.imageRequired ? Validators.required : null]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clientId = +params['id'];
      if (this.clientId) {
        this.loadClient(this.clientId);
      }
    });
  }

  loadClient(id: number): void {
    this.jobCategoryService.getById(id).subscribe({
      next: (category) => {
        this.jobCategoryForm.patchValue({
          id: category.data.id,
          name: category.data.jobCategoryName,
          imagePath: [null, this.imageRequired ? Validators.required : null]
        });
        this.currentImageUrl = category.data.imagePath;

        if (this.currentImageUrl) {
          this.jobCategoryForm.get('image')?.clearValidators();
        } else {
          this.jobCategoryForm.get('image')?.setValidators(Validators.required);
        }
        this.jobCategoryForm.get('image')?.updateValueAndValidity();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load job category';
        console.error(err);
      }
    });
  }

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.hasDeletedImage = !file && !!this.currentImageUrl;

    if (file) {
      this.currentImageUrl = null;
      this.jobCategoryForm.get('image')?.setValidators(null);
      this.jobCategoryForm.get('image')?.setErrors(null);
    } else {
      if (this.hasDeletedImage || !this.currentImageUrl) {
        this.jobCategoryForm.get('image')?.setValidators(Validators.required);
        this.jobCategoryForm.get('image')?.setErrors({ required: true });
      }
    }
    this.jobCategoryForm.get('image')?.updateValueAndValidity();
  }


  onSubmit(): void {

    if (this.jobCategoryForm.invalid) {
      this.jobCategoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('Id', this.jobCategoryForm.value.id);
    formData.append('JobCategoryName', this.jobCategoryForm.value.name!);

    if (this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    this.jobCategoryService.update(formData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        
        if (response && response.success) {  
          this.router.navigate(['/job-categories']).then(navSuccess => {
            if (!navSuccess) {
              console.warn('Navigation to /job-categories failed');
            }
          }).catch(err => {
            console.error('Navigation error:', err);
          });
        } else {
          this.errorMessage = response.message || 'Update completed but with unexpected response';
        }
      },
      error: (error) => {
        console.error('Error updating job category', error);
        this.errorMessage = error.message || 'Failed to update job category';
        this.isSubmitting = false;
      }
    });
  }
}
