import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadialMenuComponent } from './radial-menu.component';

describe('RadialMenuComponent', () => {
  let component: RadialMenuComponent;
  let fixture: ComponentFixture<RadialMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadialMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadialMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
