import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizedPopupComponent } from './unauthorized-popup.component';

describe('UnauthorizedPopupComponent', () => {
  let component: UnauthorizedPopupComponent;
  let fixture: ComponentFixture<UnauthorizedPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorizedPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnauthorizedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
