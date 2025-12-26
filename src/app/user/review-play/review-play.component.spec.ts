import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPlayComponent } from './review-play.component';

describe('ReviewPlayComponent', () => {
  let component: ReviewPlayComponent;
  let fixture: ComponentFixture<ReviewPlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewPlayComponent]
    });
    fixture = TestBed.createComponent(ReviewPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
