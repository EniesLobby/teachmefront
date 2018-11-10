import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { TreeTestComponent } from './tree-test/tree-test.component';
import { TreeComponent } from './tree/tree.component';
import { TreeService } from './tree/tree.service';
import { QuillModule } from 'ngx-quill';

import { HttpClientModule } from "@angular/common/http";
import { RightClickMenuComponent } from './right-click-menu/right-click-menu.component';
import { RadialMenuComponent } from './radial-menu/radial-menu.component';
import { ProfileComponent } from './profile/profile.component';
import { SupporterComponent } from './supporter/supporter.component';
import { QuestionEditComponent } from './question-edit/question-edit.component';
import { AnswersEditComponent } from './answers-edit/answers-edit.component';
import { InformationEditComponent } from './information-edit/information-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TreeTestComponent,
    TreeComponent,
    RightClickMenuComponent,
    RadialMenuComponent,
    ProfileComponent,
    SupporterComponent,
    QuestionEditComponent,
    AnswersEditComponent,
    InformationEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    QuillModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    QuestionEditComponent,
    AnswersEditComponent,
    InformationEditComponent,
    TreeComponent
  ],
  providers: [TreeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
