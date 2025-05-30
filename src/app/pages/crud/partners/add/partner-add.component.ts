import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from "../../../../shared/single-image-upload/single-image-upload.component";
import { HomeService } from '../../../../services/crud/home/home.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-partner-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './partner-add.component.html',
  styleUrl: './partner-add.component.scss'
})
export class PartnerAddComponent {
  partnerForm: FormGroup;
  selectedImage: File | null = null;
  isSubmitting = false;
  imageRequired = true;
  errorMessage: string | null = null;

  // private readonly twitterPattern = /^(https?:\/\/)?(www\.)?twitter\.com\/[^0-9\/]+\/?$/i;
  // private readonly linkedinPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[^0-9\/]+\/?$/i;
  // private readonly tiktokPattern = /^(https?:\/\/)?(www\.)?tiktok\.com\/@[^0-9\/]+\/?$/i;

  private readonly twitterPattern = /^[^0-9]+$/;
  private readonly linkedinPattern = /^[^0-9]+$/;
  private readonly tiktokPattern = /^[^0-9]+$/;
  private readonly webistePattern = /^[^0-9]+$/;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router
  ) {
    this.partnerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      twitterURL: ['', [Validators.pattern(this.twitterPattern)]],
      linkedinURL: ['', [Validators.pattern(this.linkedinPattern)]],
      tiktokURL: ['', [Validators.pattern(this.tiktokPattern)]],
      websiteURL: ['', [Validators.pattern(this.webistePattern)]],
      email: [''],
      image: [null, this.imageRequired ? Validators.required : null]
    });
  }

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.partnerForm.get('image')?.setValue(file ? 'valid' : null);
    this.partnerForm.get('image')?.markAsTouched();
  }

  onSocialUrlInput(fieldName: string) {
    const control = this.partnerForm.get(fieldName);
    control?.markAsTouched();
  }

  onWebsiteUrlInput(fieldName: string) {
    const control = this.partnerForm.get(fieldName);
    control?.markAsTouched();
  }

  onSubmit(): void {
    if (this.imageRequired && !this.selectedImage) {
      this.partnerForm.get('image')?.setErrors({ required: true });
    }

    if (this.partnerForm.invalid) { 
      console.log('Form errors:', this.partnerForm.errors);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('FirstName', this.partnerForm.value.firstName!);
    formData.append('LastName', this.partnerForm.value.lastName!);
    formData.append('Title', this.partnerForm.value.title!);
    formData.append('Description', this.partnerForm.value.description!);
    formData.append('TwitterUrl', this.partnerForm.value.twitterURL!);
    formData.append('TiktokUrl', this.partnerForm.value.tiktokURL!);
    formData.append('LinkedinUrl', this.partnerForm.value.linkedinURL!);
    formData.append('WebsiteUrl', this.partnerForm.value.websiteURL!);
    formData.append('MailUrl', this.partnerForm.value.email!);
    
    if (this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    this.homeService.addPartner(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.partnerForm.reset();
        this.selectedImage = null;
        this.isSubmitting = false;
        this.router.navigate(['/crud/partner']);
      },
      error: (error) => {
        console.error('Error adding testimonial', error);
        this.errorMessage = error.message || 'Failed to add testimonial';
        this.isSubmitting = false;
      }
    });
  }
}
