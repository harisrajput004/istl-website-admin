import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../../services/job/job.service';
import { HostListener } from '@angular/core';
import * as currencyCodes from 'currency-codes';

@Component({
  selector: 'app-job-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './job-edit.component.html',
  styleUrl: './job-edit.component.scss'
})

export class JobEditComponent {
  jobForm: FormGroup;
  selectedImage: File | null = null;
  hasDeletedImage = false;
  currentImageUrl: string | null = null;
  isSubmitting = false;
  imageRequired = true;
  errorMessage: string | null = null;
  jobId: number | null = null;
  tags: any[] = [];
  selectedTags: number[] = [];
  isDropdownOpen = false;
  categories: any[] = [];
  jobStatusOptions = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'Inactive' },
  ];
  currencies: any[] = [];

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const dropdown = document.getElementById('dropdown');

    if (dropdownTrigger && dropdown &&
      !dropdownTrigger.contains(event.target as Node) &&
      !dropdown.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.jobForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      currency: ['', Validators.required],
      minSalary: [null, Validators.required],
      maxSalary: [null, Validators.required],
      jobStatusId: [null, Validators.required],
      experienceYearsRequired: [null, Validators.required],
      vacancies: [null, Validators.required],
      expiresOn: ['', Validators.required],
      description: ['', Validators.required],
      responsibilities: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      jobCategoryId: [null, Validators.required],
      jobTags: this.fb.array([])
    });

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.jobId = +params['id'];
      if (this.jobId) {
        this.loadJob(this.jobId);
      }
    });
    this.loadTags();
    this.loadCategories();
    this.loadCurrencies();
  }

  loadCurrencies(): void {
    this.currencies = currencyCodes.data.map(c => ({
      code: c.code,
      name: c.currency,
      symbol: this.getCurrencySymbol(c.code)
    }));
  }


  getCurrencySymbol(code: string): string {
    try {
      return (0).toLocaleString('en', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).replace(/\d/g, '').trim();
    } catch {
      return code;
    }
  }

  isCurrencySelected(currency: any): boolean {
    if (!this.jobForm.value.currency) return false;
    const [currentCode] = this.jobForm.value.currency.split(' ');
    return currentCode === currency.code;
  }

  loadCategories(): void {
    this.jobService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadTags(): void {
    this.jobService.getAllTags().subscribe({
      next: (tags) => {
        this.tags = tags;
      },
      error: (err) => {
        console.error('Error loading tags:', err);
      }
    });
  }

  loadJob(id: number): void {
    this.jobService.getById(id).subscribe({
      next: (job) => {
        const data = job.data;
        this.jobForm.patchValue({
          id: data.id,
          title: data.title,
          currency: data.currency,
          minSalary: data.minSalary,
          maxSalary: data.maxSalary,
          jobStatusId: data.jobStatusId,
          experienceYearsRequired: data.experienceYearsRequired,
          vacancies: data.vacancies,
          expiresOn: data.expiresOn.split('T')[0],
          description: data.description,
          responsibilities: data.responsibilities,
          city: data.city,
          country: data.country,
          jobCategoryId: data.jobCategoryId
        });

        if (data.jobTags) {
          const uniqueTags = data.jobTags.reduce((acc: any[], tag: any) => {
            if (!acc.some(t => t.tagId === tag.tagId)) {
              acc.push(tag);
            }
            return acc;
          }, []);

          this.selectedTags = uniqueTags.map((tag: any) => tag.tagId);
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load partner';
        console.error(err);
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  getUniqueSelectedTags(): number[] {
    return [...new Set(this.selectedTags)];
  }

  onTagSelect(tagId: number, event?: Event): void {
    if (event) {
      event.preventDefault(); 
    }

    const index = this.selectedTags.indexOf(tagId);
    if (index === -1) {
      this.selectedTags.push(tagId);
    } else {
      this.selectedTags.splice(index, 1);
    }
  }

  removeTag(tagId: number, event: Event): void {
    event.stopPropagation();
    this.selectedTags = this.selectedTags.filter(id => id !== tagId);
  }

  getTagName(tagId: number): string {
    const tag = this.tags.find(t => t.id === tagId);
    return tag ? tag.tagName : '';
  }


  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue = {
      ...this.jobForm.value,
      jobTags: this.selectedTags.map(tagId => ({ tagId }))
    };

    this.jobService.update(formValue).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response && response.success) {
          this.router.navigate(['/jobs']);
        } else {
          this.errorMessage = response.message || 'Update completed but with unexpected response';
        }
      },
      error: (error) => {
        console.error('Error updating job', error);
        this.errorMessage = error.message || 'Failed to update job';
        this.isSubmitting = false;
      }
    });
  }
}
