import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobEditComponent } from './job-edit.component';

describe('PartnerEditComponent', () => {
  let component: JobEditComponent;
  let fixture: ComponentFixture<JobEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
