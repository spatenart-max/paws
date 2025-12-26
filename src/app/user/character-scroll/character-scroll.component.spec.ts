import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterScrollComponent } from './character-scroll.component';

describe('CharacterScrollComponent', () => {
  let component: CharacterScrollComponent;
  let fixture: ComponentFixture<CharacterScrollComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CharacterScrollComponent]
    });
    fixture = TestBed.createComponent(CharacterScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
