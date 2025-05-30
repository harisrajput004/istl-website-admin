import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerEditComponent } from './partner-edit.component';

describe('PartnerEditComponent', () => {
  let component: PartnerEditComponent;
  let fixture: ComponentFixture<PartnerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
