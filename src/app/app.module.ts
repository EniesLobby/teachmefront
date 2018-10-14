import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TreeTestComponent } from './tree-test/tree-test.component';
import { TreeComponent } from './tree/tree.component';
import { TreeService } from './tree/tree.service';

import { HttpClientModule } from "@angular/common/http";
import { RightClickMenuComponent } from './right-click-menu/right-click-menu.component';
import { RadialMenuComponent } from './radial-menu/radial-menu.component';
import { ProfileComponent } from './profile/profile.component';
import { SupporterComponent } from './supporter/supporter.component';


@NgModule({
  declarations: [
    AppComponent,
    TreeTestComponent,
    TreeComponent,
    RightClickMenuComponent,
    RadialMenuComponent,
    ProfileComponent,
    SupporterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [TreeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
