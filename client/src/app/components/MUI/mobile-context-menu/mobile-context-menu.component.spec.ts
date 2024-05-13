import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileContextMenuComponent } from './mobile-context-menu.component';

describe('MobileContextMenuComponent', () => {
  let component: MobileContextMenuComponent;
  let fixture: ComponentFixture<MobileContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileContextMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
