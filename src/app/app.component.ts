import { Component, OnChanges, Renderer, ElementRef, 
          Input, Output, EventEmitter, Inject, SimpleChanges } from '@angular/core';

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

  @Input() current_node;
  @Input() clicked_node_children;

  @Input() refreshTree = false;
  showTree: boolean = true;
  showOutlet: boolean = false;

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
     console.log(this.refreshTree);
  }
 
  public performRightClick(event) {
    
    this.hideContextMenu(true);
    this.rightClickedCoordinates = event;
  }

  public performLeftClick(event) {

    this.hideRadialMenu(true);
    this.leftClickedCoordinates = event;
  }

  public hideContextMenu(state) {

    this.showContextMenu = state;
    return false;
  }

  public hideRadialMenu(state) {

    this.showRadialMenu = state;
    return false;
  }

  public setCurrentNode(event) {

    this.current_node = event;
  }

  public setClickedNodeChildren(event) {

    this.clicked_node_children = event;
  }

}
