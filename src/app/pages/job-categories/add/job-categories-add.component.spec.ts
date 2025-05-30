import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCategoriesAddComponent } from './job-categories-add.component';

describe('ClientAddComponent', () => {
  let component: JobCategoriesAddComponent;
  let fixture: ComponentFixture<JobCategoriesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCategoriesAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCategoriesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
