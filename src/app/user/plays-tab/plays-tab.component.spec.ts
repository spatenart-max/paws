import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaysTabComponent } from './plays-tab.component';

describe('PlaysTabComponent', () => {
  let component: PlaysTabComponent;
  let fixture: ComponentFixture<PlaysTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaysTabComponent]
    });
    fixture = TestBed.createComponent(PlaysTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
