import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { JobService } from '../../../services/job/job.service';
import { CommonModule } from '@angular/common';
import * as currencyCodes from 'currency-codes'
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-job',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillEditorComponent,
    RouterLink
  ],
  templateUrl: './create-job.component.html',
  styleUrl: './create-job.component.scss'
})
export class CreateJobComponent {
  jobForm: FormGroup;
  categories: any[] = [];
  tags: any[] = [];
  selectedTags: number[] = [];
  isLoading = false;
  isDropdownOpen = false;
  errorMessage: string | null = null;
  currencies: any[] = [];
  submitted = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const dropdown = document.getElementById('dropdown');
    const dropdownTrigger = document.getElementById('dropdownTrigger');

    if (dropdown && dropdownTrigger && !dropdown.contains(event.target as Node) && !dropdownTrigger.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router
  ) {
    this.jobForm = this.fb.group({
      jobCategoryId: [null, Validators.required],
      title: ['', Validators.required],
      currency: [null, Validators.required],
      minSalary: ['', [Validators.required, Validators.min(0)]],
      maxSalary: ['', [Validators.required, Validators.min(0)]],
      jobStatusId: [1, Validators.required],
      experienceYearsRequired: ['', [Validators.required, Validators.min(0)]],
      vacancies: ['', [Validators.required, Validators.min(0)]],
      expiresOn: ['', Validators.required],
      description: ['', Validators.required],
      responsibilities: ['', Validators.required],
      city: ['', [Validators.required, this.lettersOnlyValidator.bind(this)]],
      country: ['', [Validators.required, this.lettersOnlyValidator.bind(this)]],
      jobTags: [[], Validators.required]
    });
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null; // Skip validation if empty

    const selectedDate = new Date(control.value);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      return { minDate: { requiredDate: tomorrow } };
    }
    return null;
  }

  private stripHtml(html: string): string {
    if (!html) return '';

    const tmp = document.createElement('div');
    tmp.innerHTML = html;

    return tmp.textContent || tmp.innerText || '';
  }

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      currency: [''] // This will make the placeholder work
    });

    this.loadCategories();
    this.loadTags();
    this.loadCurrencies();
  }

  loadCurrencies(): void {
    this.currencies = currencyCodes.data.map(c => ({
      code: c.code,
      name: c.currency,
      symbol: this.getCurrencySymbol(c.code)
    }));

    if (!this.jobForm.get('currency')?.value?.trim()) {
      const defaultCurrency = this.currencies.find(c => c.code === 'NGN');
      if (defaultCurrency) {
        this.jobForm.patchValue({ currency: `${defaultCurrency.code} ${defaultCurrency.symbol}` });
      }
    }
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

  private lettersOnlyValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null; 
    
    const regex = /^[a-zA-Z\s]*$/; 
    return regex.test(control.value) ? null : { lettersOnly: true };
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

  onTagSelect(tagId: number, event: any): void {
    if (event.target.checked) {
      if (!this.selectedTags.includes(tagId)) {
        this.selectedTags.push(tagId);
      }
    } else {
      this.selectedTags = this.selectedTags.filter(id => id !== tagId);
    }
  }

  getMinDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.selectedTags.length === 0) {
      this.jobForm.get('jobTags')?.setErrors({ required: true });
    } else {
      this.jobForm.get('jobTags')?.setErrors(null);
    }

    if (this.jobForm.invalid) {
      Object.keys(this.jobForm.controls).forEach(key => {
        this.jobForm.get(key)?.markAsTouched();
      });
      return;
    }

    const currencyParts = this.jobForm.value.currency.split(' ');
    const currencyCode = currencyParts[0];
    const currencySymbol = currencyParts.length > 1 ? currencyParts[1] : '';

    const formValue = {
      ...this.jobForm.value,
      jobCategoryId: Number(this.jobForm.value.jobCategoryId),
      currency: currencySymbol === currencyCode ? currencyCode : `${currencyCode} ${currencySymbol}`,
      minSalary: Number(this.jobForm.value.minSalary),
      maxSalary: Number(this.jobForm.value.maxSalary),
      experienceYearsRequired: Number(this.jobForm.value.experienceYearsRequired),
      vacancies: Number(this.jobForm.value.vacancies),
      responsibilities: this.stripHtml(this.jobForm.value.responsibilities),
      description: this.stripHtml(this.jobForm.value.description),
      jobTags: this.selectedTags.map(tagId => ({ tagId })),
      expiresOn: this.jobForm.value.expiresOn,
    };

    this.isLoading = true;
    this.errorMessage = null;

    this.jobService.createJob(formValue).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.jobForm.reset();
        this.router.navigate(['/jobs']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to create job';
      }
    });
  }

  jobTagsInput = '';

  addTag(): void {
    const tag = this.jobTagsInput.trim();
    if (tag && !this.jobForm.value.jobTags.includes(tag)) {
      this.jobForm.patchValue({
        jobTags: [...this.jobForm.value.jobTags, tag]
      });
    }
    this.jobTagsInput = '';
  }

  getTagName(tagId: number): string {
    const tag = this.tags.find(t => t.id === tagId);
    return tag ? tag.tagName : '';
  }

  removeTag(tagId: number): void {
    this.selectedTags = this.selectedTags.filter(id => id !== tagId);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}
