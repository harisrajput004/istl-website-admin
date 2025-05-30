import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from '../../../../shared/single-image-upload/single-image-upload.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HomeService } from '../../../../services/crud/home/home.service';

@Component({
  selector: 'app-partner-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './partner-edit.component.html',
  styleUrl: './partner-edit.component.scss'
})
export class PartnerEditComponent {
  partnerForm: FormGroup;
  selectedImage: File | null = null;
  hasDeletedImage = false;
  currentImageUrl: string | null = null;
  isSubmitting = false;
  imageRequired = true;
  errorMessage: string | null = null;
  partnerId: number | null = null;

  private readonly twitterPattern = /^[^0-9]+$/;
  private readonly linkedinPattern = /^[^0-9]+$/;
  private readonly tiktokPattern = /^[^0-9]+$/;
  private readonly websitePattern = /^[^0-9]+$/;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.partnerForm = this.fb.group({
      id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      twitterURL: ['', [Validators.pattern(this.twitterPattern)]],
      linkedinURL: ['', [Validators.pattern(this.linkedinPattern)]],
      tiktokURL: ['', [Validators.pattern(this.tiktokPattern)]],
      websiteURL: ['', [Validators.pattern(this.websitePattern)]],
      email: [''],
      image: [null, this.imageRequired ? Validators.required : null]
    });
  }
  
  onSocialUrlInput(fieldName: string) {
    const control = this.partnerForm.get(fieldName);
    control?.markAsTouched();
  }

  onWebsiteUrlInput(fieldName: string) {
    const control = this.partnerForm.get(fieldName);
    control?.markAsTouched();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.partnerId = +params['id'];
      if (this.partnerId) {
        this.loadPartner(this.partnerId);
      }
    });
  }

  loadPartner(id: number): void {
    this.homeService.getPartnerById(id).subscribe({
      next: (partner) => {
        this.partnerForm.patchValue({
          id: partner.data.id,
          firstName: partner.data.firstName,
          lastName: partner.data.lastName,
          title: partner.data.title,
          description: partner.data.description,
          twitterURL: partner.data.twitterUrl,
          tiktokURL: partner.data.tiktokUrl,
          email: partner.data.mailUrl,
          linkedinURL: partner.data.linkedinUrl,
          websiteURL: partner.data.websiteUrl,
          image: [null, this.imageRequired ? Validators.required : null]
        });
        this.currentImageUrl = partner.data.image;

        if (this.currentImageUrl) {
          this.partnerForm.get('image')?.clearValidators();
        } else {
          this.partnerForm.get('image')?.setValidators(Validators.required);
        }
        this.partnerForm.get('image')?.updateValueAndValidity();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load partner';
        console.error(err);
      }
    });
  }

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.hasDeletedImage = !file && !!this.currentImageUrl;

    if (file) {
      this.currentImageUrl = null;
      this.partnerForm.get('image')?.setValidators(null);
      this.partnerForm.get('image')?.setErrors(null);
    } else {
      if (this.hasDeletedImage || !this.currentImageUrl) {
        this.partnerForm.get('image')?.setValidators(Validators.required);
        this.partnerForm.get('image')?.setErrors({ required: true });
      }
    }
    this.partnerForm.get('image')?.updateValueAndValidity();
  }


  onSubmit(): void {

    if (this.partnerForm.invalid) {
      this.partnerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('Id', this.partnerForm.value.id);
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

    this.homeService.updatePartner(formData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        
        if (response && response.success) {  
          this.router.navigate(['/crud/partner']).then(navSuccess => {
            if (!navSuccess) {
              console.warn('Navigation to /crud/partner failed');
            }
          }).catch(err => {
            console.error('Navigation error:', err);
          });
        } else {
          this.errorMessage = response.message || 'Update completed but with unexpected response';
        }
      },
      error: (error) => {
        console.error('Error updating partner', error);
        this.errorMessage = error.message || 'Failed to update partner';
        this.isSubmitting = false;
      }
    });
  }
}
