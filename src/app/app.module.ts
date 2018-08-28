import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TreeTestComponent } from './tree-test/tree-test.component';
import { TreeComponent } from './tree/tree.component';
import { TreeService } from './tree/tree.service';

import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    TreeTestComponent,
    TreeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [TreeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
