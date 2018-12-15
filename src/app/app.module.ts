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
import { HelperComponent } from './helper/helper.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { AddInformationComponent } from './add-information/add-information.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { RouterModule, Routes } from '@angular/router';
import { UserServiceComponent } from './user-service/user-service.component';

const appRoutes: Routes = [
    { path: '', component: UserLoginComponent },
    { path: 'tree', component: TreeComponent }
  ];

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
    InformationEditComponent,
    HelperComponent,
    TooltipComponent,
    AddInformationComponent,
    UserLoginComponent,
    UserServiceComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),
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
