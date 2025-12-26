import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAdminComponent } from './payment-admin.component';

describe('PaymentAdminComponent', () => {
  let component: PaymentAdminComponent;
  let fixture: ComponentFixture<PaymentAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentAdminComponent]
    });
    fixture = TestBed.createComponent(PaymentAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
