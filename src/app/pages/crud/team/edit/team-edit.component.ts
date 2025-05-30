import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from '../../../../shared/single-image-upload/single-image-upload.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HomeService } from '../../../../services/crud/home/home.service';

@Component({
  selector: 'app-team-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SingleImageUploadComponent, RouterLink],
  templateUrl: './team-edit.component.html',
  styleUrl: './team-edit.component.scss'
})
export class TeamEditComponent {
  teamForm: FormGroup;
  selectedImage: File | null = null;
  hasDeletedImage = false;
  currentImageUrl: string | null = null;
  isSubmitting = false;
  imageRequired = true;
  errorMessage: string | null = null;
  teamId: number | null = null;
  
  private readonly twitterPattern = /^[^0-9]+$/;
  private readonly linkedinPattern = /^[^0-9]+$/;
  private readonly tiktokPattern = /^[^0-9]+$/;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.teamForm = this.fb.group({
      id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      twitterURL: ['', [Validators.pattern(this.twitterPattern)]],
      linkedinURL: ['', [Validators.pattern(this.linkedinPattern)]],
      tiktokURL: ['', [Validators.pattern(this.tiktokPattern)]],
      email: [''],
      image: [null, this.imageRequired ? Validators.required : null]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.teamId = +params['id'];
      if (this.teamId) {
        this.loadTeam(this.teamId);
      }
    });
  }

  onSocialUrlInput(fieldName: string) {
    const control = this.teamForm.get(fieldName);
    control?.markAsTouched();
  }

  loadTeam(id: number): void {
    this.homeService.getTeamMemberById(id).subscribe({
      next: (teamMember) => {
        this.teamForm.patchValue({
          id: teamMember.data.id,
          firstName: teamMember.data.firstName,
          lastName: teamMember.data.lastName,
          title: teamMember.data.title,
          description: teamMember.data.description,
          twitterURL: teamMember.data.twitterUrl,
          tiktokURL: teamMember.data.tiktokUrl,
          email: teamMember.data.mailUrl,
          linkedinURL: teamMember.data.linkedinUrl,
          image: [null, this.imageRequired ? Validators.required : null]
        });
        this.currentImageUrl = teamMember.data.image;

        if (this.currentImageUrl) {
          this.teamForm.get('image')?.clearValidators();
        } else {
          this.teamForm.get('image')?.setValidators(Validators.required);
        }
        this.teamForm.get('image')?.updateValueAndValidity();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load team';
        console.error(err);
      }
    });
  }

  handleImage(file: File | null) {
    this.selectedImage = file;
    this.hasDeletedImage = !file && !!this.currentImageUrl;

    if (file) {
      this.currentImageUrl = null;
      this.teamForm.get('image')?.setValidators(null);
      this.teamForm.get('image')?.setErrors(null);
    } else {
      if (this.hasDeletedImage || !this.currentImageUrl) {
        this.teamForm.get('image')?.setValidators(Validators.required);
        this.teamForm.get('image')?.setErrors({ required: true });
      }
    }
    this.teamForm.get('image')?.updateValueAndValidity();
  }


  onSubmit(): void {

    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('Id', this.teamForm.value.id);
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

    this.homeService.updateTeamMember(formData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;

        if (response && response.success) {
          this.router.navigate(['/crud/team']).then(navSuccess => {
            if (!navSuccess) {
              console.warn('Navigation to /crud/team failed');
            }
          }).catch(err => {
            console.error('Navigation error:', err);
          });
        } else {
          this.errorMessage = response.message || 'Update completed but with unexpected response';
        }
      },
      error: (error) => {
        console.error('Error updating team', error);
        this.errorMessage = error.message || 'Failed to update team';
        this.isSubmitting = false;
      }
    });
  }
}
