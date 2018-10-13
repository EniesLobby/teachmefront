import { Component, OnChanges, Renderer, ElementRef, Input, Output, EventEmitter, Inject } from '@angular/core';

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
    this.rightClickedCoordinates = event;
    this.showContextMenu = true;
    console.log("ae2");
    console.log(event);
  }

  public hideContextMenu(state) {
    this.showContextMenu = state;
    console.log(state);

    return false;
  }

}
