import { Component, OnChanges, Renderer, ElementRef, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {  
  
  title = 'TEACHME';
  @Input() rightClickedCoordinates;
  @Input() showContextMenu;

  public performRightClick(event) {
    
    this.hideContextMenu(true);
    this.rightClickedCoordinates = event;
  }

  public hideContextMenu(state) {

    this.showContextMenu = state;
    console.log("state from app.compoonent = " + state);

    return false;
  }

}
