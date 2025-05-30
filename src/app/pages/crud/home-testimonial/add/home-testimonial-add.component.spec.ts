import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTestimonialAddComponent } from './home-testimonial-add.component';

describe('HomeTestimonialAddComponent', () => {
  let component: HomeTestimonialAddComponent;
  let fixture: ComponentFixture<HomeTestimonialAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTestimonialAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTestimonialAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
