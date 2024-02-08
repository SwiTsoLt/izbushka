import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarMenuLinkComponent } from './navbar-menu-link.component';

describe('NavbarMenuLinkComponent', () => {
  let component: NavbarMenuLinkComponent;
  let fixture: ComponentFixture<NavbarMenuLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarMenuLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarMenuLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
