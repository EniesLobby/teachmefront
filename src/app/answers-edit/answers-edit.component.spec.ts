import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersEditComponent } from './answers-edit.component';

describe('AnswersEditComponent', () => {
  let component: AnswersEditComponent;
  let fixture: ComponentFixture<AnswersEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswersEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
