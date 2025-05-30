import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCategoriesEditComponent } from './job-categories-edit.component';

describe('ClientEditComponent', () => {
  let component: JobCategoriesEditComponent;
  let fixture: ComponentFixture<JobCategoriesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCategoriesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCategoriesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
