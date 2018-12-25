import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInformationEditComponent } from './general-information-edit.component';

describe('GeneralInformationEditComponent', () => {
  let component: GeneralInformationEditComponent;
  let fixture: ComponentFixture<GeneralInformationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralInformationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInformationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
