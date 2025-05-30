import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CmsService } from '../../services/cms/cms.service'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cms',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './cms.component.html',
  styleUrl: './cms.component.scss'
})

export class CmsComponent {
  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;

  pages: any[] = [];

  pageRoutes: { [key: number]: string } = {
    1: 'home',
    2: 'about',
    3: 'services',
    4: 'management',
    5: 'partners',
    8: 'contact',
    10: 'vacancy',
    11: 'sitemap'
  };

  constructor(private cmsService: CmsService) {} 

  filteredPages:any[] = [];

  ngOnInit(): void {
    this.cmsService.getAllPages().subscribe({
      next: (response) => {
        this.filteredPages = response.filter((page: any) => page.id !== 6);
      },
      error: (err) => {
        console.error('Error fetching pages:', err);
      }
    });
  }
}
