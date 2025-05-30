import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTestimonialEditComponent } from './home-testimonial-edit.component';

describe('HomeTestimonialEditComponent', () => {
  let component: HomeTestimonialEditComponent;
  let fixture: ComponentFixture<HomeTestimonialEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTestimonialEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTestimonialEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
