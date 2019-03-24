import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { TreeComponent } from './tree/tree.component';
import { TreeService } from './tree/tree.service';
import { QuillModule } from 'ngx-quill';
import { HttpClientModule } from "@angular/common/http";
import { RadialMenuComponent } from './radial-menu/radial-menu.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelperComponent, NgbdModal2Content } from './helper/helper.component';
import { AddInformationComponent } from './add-information/add-information.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { RouterModule, Routes } from '@angular/router';
import { UserServiceComponent } from './user-service/user-service.component';
import { NodeEditorComponent } from './node-editor/node-editor.component';
import { TreeManagerComponent } from './tree-manager/tree-manager.component';
import { StudentViewComponent } from './student-view/student-view.component';
import { BlockViewComponent } from './student-view/block-view/block-view.component';
import { TutorialComponent } from './tutorial/tutorial.component';
 

const appRoutes: Routes = [
    { path: '', component: UserLoginComponent },
    { path: 'tree', component: TreeComponent },
    { path: 'student', component: StudentViewComponent }
  ];

@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    RadialMenuComponent,
    ProfileComponent,
    HelperComponent,
    AddInformationComponent,
    UserLoginComponent,
    UserServiceComponent,
    NodeEditorComponent,
    TreeManagerComponent,
    StudentViewComponent,
    BlockViewComponent,
    NgbdModal2Content,
    TutorialComponent
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
    TreeComponent,
    NodeEditorComponent,
    TreeManagerComponent,
    StudentViewComponent,
    NgbdModal2Content,
    TutorialComponent
  ],
  providers: [TreeService],
  bootstrap: [AppComponent]
})

export class AppModule { }
