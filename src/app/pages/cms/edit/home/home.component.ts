import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CmsService } from '../../../../services/cms/cms.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../../shared/success-dialog/success-dialog.component';
import { SingleImageUploadComponent } from '../../../../shared/single-image-upload/single-image-upload.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SingleImageUploadComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  sections: any = null;
  pageId: number = 0;
  saving: boolean = false;

  originalBackgroundImage: File | null = null;
  originalServiceImages: File[] = [];
  originalDetailedServiceImages: File[] = [];

  backgroundImageFile: File | null = null;
  serviceImageFiles: (File | null)[] = [];
  detailedImageFiles: (File | null)[] = [];

  constructor(private cmsService: CmsService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.cmsService.getSectionsByPageId(1).subscribe({
      next: async (response) => {
        this.sections = response.sections.map((section: any) => {
          if (section.detailedServices) {
            return {
              ...section,
              detailedServices: section.detailedServices.map((service: any) => ({ ...service }))
            };
          }
          return section;
        });
        this.pageId = response.pageId;
        
        if (this.sections[0]?.backgroundImagePath) {
          this.originalBackgroundImage = await this.urlToFile(
            this.sections[0].backgroundImagePath,
            'background.jpg'
          );
        }

        // Load service images as Files
        if (this.sections[1]?.services) {
          this.originalServiceImages = await Promise.all(
            this.sections[1].services
              .filter((service: any) => service.logoPath)
              .map((service: any) =>
                this.urlToFile(service.logoPath, `service-${service.id}.jpg`)
              )
          );
          this.serviceImageFiles = new Array(this.sections[1].services.length).fill(null);
        }

        if (this.sections[2]?.detailedServices) {
          this.originalDetailedServiceImages = await Promise.all(
            this.sections[2].detailedServices
              .filter((service: any) => service.iconPath)
              .map((service: any) =>
                this.urlToFile(service.iconPath, `detailed-${service.id}.jpg`)
              )
          );
          this.detailedImageFiles = new Array(this.sections[2].detailedServices.length).fill(null);
        }

        console.log(this.sections[5]);
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

  trackByServiceId(index: number, item: any): number {
    return item.id || index; // fallback to index if id doesn't exist
  }


  onBackgroundSelected(file: File | null) {
    this.backgroundImageFile = file;
  }

  onServiceSelected(idx: number, file: File | null) {
    this.serviceImageFiles[idx] = file;
  }

  onDetailedSelected(idx: number, file: File | null) {
    this.detailedImageFiles[idx] = file;
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

    this.cmsService.updateHomeSections(this.pageId, this.sections).subscribe({
      next: () => {
        const formData = new FormData();

        const backgroundToSend = this.backgroundImageFile || this.originalBackgroundImage;
        if (backgroundToSend) {
          formData.append('BackgroundImage', backgroundToSend);
        }

        const allServiceImages: File[] = [];

        this.originalServiceImages.forEach((originalFile, index) => {
          const newFile = this.serviceImageFiles[index];
          allServiceImages.push(newFile || originalFile);
        });

        for (let i = this.originalServiceImages.length; i < this.serviceImageFiles.length; i++) {
          if (this.serviceImageFiles[i]) {
            allServiceImages.push(this.serviceImageFiles[i]!);
          }
        }

        allServiceImages.forEach(file => {
          formData.append('ServiceImages', file);
        });

        const allDetailedServiceImages: File[] = [];

        this.originalDetailedServiceImages.forEach((originalFile, index) => {
          const newFile = this.detailedImageFiles[index];
          allDetailedServiceImages.push(newFile || originalFile);
        });

        for (let i = this.originalDetailedServiceImages.length; i < this.detailedImageFiles.length; i++) {
          if (this.detailedImageFiles[i]) {
            allDetailedServiceImages.push(this.detailedImageFiles[i]!);
          }
        }

        allDetailedServiceImages.forEach(file => {
          formData.append('DetailedServiceImages', file);
        });

        this.cmsService.updateHomeSectionsImages(formData).subscribe({
          next: () => this.openSuccessDialog(),
          error: err => {
            console.error('Error updating images:', err);
            alert('Failed to update images. Please try again.');
          }
        });
      },
      error: (err) => {
        console.error('Error updating sections:', err);
        alert('Failed to update sections. Please try again.');
      },
    });
  }
}
