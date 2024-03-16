import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorLocationComponent } from './selector-location.component';

describe('SelectorLocationComponent', () => {
  let component: SelectorLocationComponent;
  let fixture: ComponentFixture<SelectorLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorLocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectorLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
