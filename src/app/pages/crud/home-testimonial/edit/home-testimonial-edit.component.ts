import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from '../../../../shared/single-image-upload/single-image-upload.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HomeService } from '../../../../services/crud/home/home.service';

@Component({
  selector: 'app-home-testimonial-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './home-testimonial-edit.component.html',
  styleUrl: './home-testimonial-edit.component.scss'
})
export class HomeTestimonialEditComponent {
  testimonialForm: FormGroup;
  selectedImage: File | null = null;
  hasDeletedImage = false;
  currentImageUrl: string | null = null;
  isSubmitting = false;
  imageRequired = true;
  errorMessage: string | null = null;
  testimonialId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.testimonialForm = this.fb.group({
      id: [null],
      clientName: ['', Validators.required],
      comment: ['', Validators.required],
      clientOccupation: ['', Validators.required],
      image: [null, this.imageRequired ? Validators.required : null]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.testimonialId = +params['id'];
      if (this.testimonialId) {
        this.loadTestimonial(this.testimonialId);
      }
    });
  }

  loadTestimonial(id: number): void {
    this.homeService.getTestimonialById(id).subscribe({
      next: (testimonial) => {
        this.testimonialForm.patchValue({
          id: testimonial.data.id,
          clientName: testimonial.data.clientName,
          comment: testimonial.data.comment,
          clientOccupation: testimonial.data.clientOccupation
        });
        this.currentImageUrl = testimonial.data.imagePath;

        if (this.currentImageUrl) {
          this.testimonialForm.get('image')?.clearValidators();
        } else {
          this.testimonialForm.get('image')?.setValidators(Validators.required);
        }
        this.testimonialForm.get('image')?.updateValueAndValidity();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load testimonial';
        console.error(err);
      }
    });
  }

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.hasDeletedImage = !file && !!this.currentImageUrl;

    if (file) {
      this.currentImageUrl = null;
      this.testimonialForm.get('image')?.setValidators(null);
      this.testimonialForm.get('image')?.setErrors(null);
    } else {
      if (this.hasDeletedImage || !this.currentImageUrl) {
        this.testimonialForm.get('image')?.setValidators(Validators.required);
        this.testimonialForm.get('image')?.setErrors({ required: true });
      }
    }
    this.testimonialForm.get('image')?.updateValueAndValidity();
  }


  onSubmit(): void {

    if (this.testimonialForm.invalid) {
      this.testimonialForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('Id', this.testimonialForm.value.id);
    formData.append('ClientName', this.testimonialForm.value.clientName);
    formData.append('Comment', this.testimonialForm.value.comment);
    formData.append('ClientOccupation', this.testimonialForm.value.clientOccupation);

    if (this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    this.homeService.updateTestimonial(formData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        
        if (response && response.success) {  // or response.status === 200, etc.
          this.router.navigate(['/crud/home-testimonial']).then(navSuccess => {
            if (!navSuccess) {
              console.warn('Navigation to /crud/home-testimonial failed');
            }
          }).catch(err => {
            console.error('Navigation error:', err);
          });
        } else {
          this.errorMessage = response.message || 'Update completed but with unexpected response';
        }
      },
      error: (error) => {
        console.error('Error updating testimonial', error);
        this.errorMessage = error.message || 'Failed to update testimonial';
        this.isSubmitting = false;
      }
    });
  }
}
