import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CmsService } from '../../../../services/cms/cms.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../../shared/success-dialog/success-dialog.component';
import { SingleImageUploadComponent } from '../../../../shared/single-image-upload/single-image-upload.component';

@Component({
  selector: 'app-partners',
  imports: [CommonModule, FormsModule, RouterLink, SingleImageUploadComponent],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss' 
})
export class PartnersComponent {
  sections: any = null;
  pageId: number = 0;
  saving: boolean = false;

  originalBannerImage: File | null = null;

  bannerImageFile: File | null = null;

  constructor(private cmsService: CmsService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cmsService.getSectionsByPageId(5).subscribe({
      next: async (response) => {
        this.sections = response.sections;
        this.pageId = response.pageId;

        if (this.sections[0]?.backgroundImagePath) {
          this.originalBannerImage = await this.urlToFile(
            this.sections[0].backgroundImagePath,
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
    if (!this.sections || !this.pageId) {
      console.error('Sections or pageId is missing');
      return;
    }
    
    this.saving = true;
  
    this.cmsService.updateSections(this.pageId, this.sections).subscribe({
      next: (response) => {
        const formData = new FormData();

        const bannerToSend = this.bannerImageFile || this.originalBannerImage;
        if (bannerToSend) {
          formData.append('BannerImage', bannerToSend);
        }
        
        if (bannerToSend) {
          this.cmsService.updatePartnersSectionImage(formData).subscribe({
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
        console.error('Error updating sections:', err);
        alert('Failed to update sections. Please try again.');
      },
    });
  }
}
