import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from "../../../../shared/single-image-upload/single-image-upload.component";
import { HomeService } from '../../../../services/crud/home/home.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-team-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './team-add.component.html',
  styleUrl: './team-add.component.scss'
})
export class TeamAddComponent {
  teamForm: FormGroup;
  selectedImage: File | null = null;
  isSubmitting = false;
  imageRequired = true;
  errorMessage: string | null = null;

  private readonly twitterPattern = /^[^0-9]+$/;
  private readonly linkedinPattern = /^[^0-9]+$/;
  private readonly tiktokPattern = /^[^0-9]+$/;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router
  ) {
    this.teamForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      twitterURL: ['', [Validators.pattern(this.twitterPattern)]],
      linkedinURL: ['', [Validators.pattern(this.linkedinPattern)]],
      tiktokURL: ['', [Validators.pattern(this.tiktokPattern)]],
      email: [''],
      image: [null, this.imageRequired ? Validators.required : null]
    }, { updateOn: 'change' });
  }

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.teamForm.get('image')?.setValue(file ? 'valid' : null);
    this.teamForm.get('image')?.markAsTouched();
  }

  onSocialUrlInput(fieldName: string) {
    const control = this.teamForm.get(fieldName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();

      if (!control.value && control.errors?.['pattern']) {
        control.setErrors(null);
      }
    }
  }

  onSubmit(): void {
    if (this.imageRequired && !this.selectedImage) {
      this.teamForm.get('image')?.setErrors({ required: true });
    }

    if (this.teamForm.invalid) {
      console.log('Form errors:', this.teamForm.errors);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('FirstName', this.teamForm.value.firstName!);
    formData.append('LastName', this.teamForm.value.lastName!);
    formData.append('Title', this.teamForm.value.title!);
    formData.append('Description', this.teamForm.value.description!);
    formData.append('TwitterUrl', this.teamForm.value.twitterURL!);
    formData.append('TiktokUrl', this.teamForm.value.tiktokURL!);
    formData.append('LinkedinUrl', this.teamForm.value.linkedinURL!);
    formData.append('MailUrl', this.teamForm.value.email!);

    if (this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    this.homeService.addTeamMember(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.teamForm.reset();
        this.selectedImage = null;
        this.isSubmitting = false;
        this.router.navigate(['/crud/team']);
      },
      error: (error) => {
        console.error('Error adding testimonial', error);
        this.errorMessage = error.message || 'Failed to add testimonial';
        this.isSubmitting = false;
      }
    });
  }
}
