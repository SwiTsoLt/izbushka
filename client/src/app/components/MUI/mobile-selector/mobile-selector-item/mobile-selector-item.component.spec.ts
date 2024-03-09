import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileSelectorItemComponent } from './mobile-selector-item.component';

describe('MobileSelectorItemComponent', () => {
  let component: MobileSelectorItemComponent;
  let fixture: ComponentFixture<MobileSelectorItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileSelectorItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileSelectorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
