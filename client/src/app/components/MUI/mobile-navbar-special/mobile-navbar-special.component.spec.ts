import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNavbarSpecialComponent } from './mobile-navbar-special.component';

describe('MobileNavbarComponent', () => {
  let component: MobileNavbarSpecialComponent;
  let fixture: ComponentFixture<MobileNavbarSpecialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileNavbarSpecialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileNavbarSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
