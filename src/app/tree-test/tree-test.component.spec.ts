import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeTestComponent } from './tree-test.component';

describe('TreeTestComponent', () => {
  let component: TreeTestComponent;
  let fixture: ComponentFixture<TreeTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
