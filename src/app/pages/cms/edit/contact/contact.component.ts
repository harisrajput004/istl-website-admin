import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CmsService } from '../../../../services/cms/cms.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../../shared/success-dialog/success-dialog.component';
import { SingleImageUploadComponent } from '../../../../shared/single-image-upload/single-image-upload.component';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, RouterLink, SingleImageUploadComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  data: any = null;
  id: number = 0;
  sections: any = null;
  saving: boolean = false;

  originalBannerImage: File | null = null;

  bannerImageFile: File | null = null;

  constructor(private cmsService: CmsService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cmsService.getSectionsByPageId(8).subscribe({
      next: async (response) => {
        this.data = response;
        this.id = response.id;
        console.log(this.data)
        if (this.data.bannerImage) {
          this.originalBannerImage = await this.urlToFile(
            this.data.bannerImage,
            'banner.jpg'
          );
        }
      },
      error: (err) => {
        console.error('Error fetching section:', err);
      }
    });
  }

  private async urlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  onBannerSelected(file: File | null) {
    this.bannerImageFile = file;
  }

  openSuccessDialog(): void {
    this.saving = false;

    this.dialog.open(SuccessDialogComponent, {
      disableClose: true,
      data: { message: 'Your changes have been successfully saved.' }
    });
  }

  onSubmit(): void {
    if (!this.data) {
      console.error('Data is missing');
      return;
    }

    this.saving = true;

    this.cmsService.updateContactPage(this.id, this.data).subscribe({
      next: (response) => {
        const formData = new FormData();

        const bannerToSend = this.bannerImageFile || this.originalBannerImage;
        if (bannerToSend) {
          formData.append('BannerImage', bannerToSend);
        }

        if (bannerToSend) {
          this.cmsService.updateContactSectionImage(formData).subscribe({
            next: () => this.openSuccessDialog(),
            error: err => {
              console.error('Error updating images:', err);
              alert('Failed to update images. Please try again.');
            }
          });
        } else {
          this.openSuccessDialog();
        }
      },
      error: (err) => {
        console.error('Error updating contact page:', err);
        alert('Failed to update contact page. Please try again.');
      },
    });
  }
}
