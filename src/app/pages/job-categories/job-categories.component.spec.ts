import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCategoriesComponent } from './job-categories.component';

describe('JobsComponent', () => {
  let component: JobCategoriesComponent;
  let fixture: ComponentFixture<JobCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
