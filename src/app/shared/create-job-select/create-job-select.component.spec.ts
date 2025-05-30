import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobSelectComponent } from './create-job-select.component';

describe('CreateJobSelectComponent', () => {
  let component: CreateJobSelectComponent;
  let fixture: ComponentFixture<CreateJobSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateJobSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateJobSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
