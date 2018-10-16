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

  @Input() leftClickedCoordinates;
  @Input() showRadialMenu;

  public performRightClick(event) {
    
    this.hideContextMenu(true);
    this.rightClickedCoordinates = event;
  }

  public performLeftClick(event) {

    this.hideRadialMenu(true);
    this.leftClickedCoordinates = event;
    console.log("left click performed")
  }

  public hideContextMenu(state) {

    this.showContextMenu = state;
    return false;
  }

  public hideRadialMenu(state) {
    this.showRadialMenu = state;

    return false;
  }

}
