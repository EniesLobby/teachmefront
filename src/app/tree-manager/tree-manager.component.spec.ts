import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeManagerComponent } from './tree-manager.component';

describe('TreeManagerComponent', () => {
  let component: TreeManagerComponent;
  let fixture: ComponentFixture<TreeManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
