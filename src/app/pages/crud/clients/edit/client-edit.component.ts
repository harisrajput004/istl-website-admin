import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from '../../../../shared/single-image-upload/single-image-upload.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HomeService } from '../../../../services/crud/home/home.service';

@Component({
  selector: 'app-client-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss'
})
export class ClientEditComponent {
  clientForm: FormGroup;
  selectedImage: File | null = null;
  hasDeletedImage = false;
  currentImageUrl: string | null = null;
  isSubmitting = false;
  imageRequired = true;
  errorMessage: string | null = null;
  clientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      url: ['', {
        validators: [this.noNumbersValidator],
        updateOn: 'change'
      }], image: [null, this.imageRequired ? Validators.required : null]
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

  noNumbersValidator(control: any) {
    const hasNumbers = /\d/.test(control.value);
    return hasNumbers ? { containsNumbers: true } : null;
  }

  onUrlInput() {
    const urlControl = this.clientForm.get('url');
    urlControl?.markAsTouched();
  }

  loadClient(id: number): void {
    this.homeService.getClientById(id).subscribe({
      next: (client) => {
        this.clientForm.patchValue({
          id: client.data.id,
          name: client.data.name,
          url: client.data.url,
          image: [null, this.imageRequired ? Validators.required : null]
        });
        this.currentImageUrl = client.data.image;

        if (this.currentImageUrl) {
          this.clientForm.get('image')?.clearValidators();
        } else {
          this.clientForm.get('image')?.setValidators(Validators.required);
        }
        this.clientForm.get('image')?.updateValueAndValidity();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load client';
        console.error(err);
      }
    });
  }

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.hasDeletedImage = !file && !!this.currentImageUrl;

    if (file) {
      this.currentImageUrl = null;
      this.clientForm.get('image')?.setValidators(null);
      this.clientForm.get('image')?.setErrors(null);
    } else {
      if (this.hasDeletedImage || !this.currentImageUrl) {
        this.clientForm.get('image')?.setValidators(Validators.required);
        this.clientForm.get('image')?.setErrors({ required: true });
      }
    }
    this.clientForm.get('image')?.updateValueAndValidity();
  }


  onSubmit(): void {

    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('Id', this.clientForm.value.id);
    formData.append('Name', this.clientForm.value.name!);
    formData.append('Url', this.clientForm.value.url!);

    if (this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    this.homeService.updateClient(formData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;

        if (response && response.success) {
          this.router.navigate(['/crud/client']).then(navSuccess => {
            if (!navSuccess) {
              console.warn('Navigation to /crud/client failed');
            }
          }).catch(err => {
            console.error('Navigation error:', err);
          });
        } else {
          this.errorMessage = response.message || 'Update completed but with unexpected response';
        }
      },
      error: (error) => {
        console.error('Error updating client', error);
        this.errorMessage = error.message || 'Failed to update client';
        this.isSubmitting = false;
      }
    });
  }
}
