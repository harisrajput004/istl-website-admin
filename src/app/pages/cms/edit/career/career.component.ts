import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CmsService } from '../../../../services/cms/cms.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../../shared/success-dialog/success-dialog.component';

@Component({
  selector: 'app-career',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './career.component.html',
  styleUrl: './career.component.scss'
})
export class CareerComponent {
  sections: any = null;
  pageId: number = 0;
  saving: boolean = false;

  constructor(private cmsService: CmsService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.cmsService.getSectionsByPageId(7).subscribe({
      next: (response) => {
        this.sections = response.sections;
        this.pageId = response.pageId;
      },
      error: (err) => {
        console.error('Error fetching section:', err);
      }
    });
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

    this.saving = false;

    this.cmsService.updateSections(this.pageId, this.sections).subscribe({
      next: (response) => {
        this.openSuccessDialog();
      },
      error: (err) => {
        console.error('Error updating sections:', err);
        alert('Failed to update sections. Please try again.');
      },
    });
  }
}
