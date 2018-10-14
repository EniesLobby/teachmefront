import { Component, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-right-click-menu',
  templateUrl: './right-click-menu.component.html',
  styleUrls: ['./right-click-menu.component.css']
})
export class RightClickMenuComponent implements OnChanges, OnInit  {

  @Input() showContextMenu;
  @Input() rightClickedCoordinates;
  
  x = 500;
  y = 500;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

    $("#nodeContextMenu").on("contextmenu", function(e) {
      return false;
    });

    console.log("hello from right click");

    if( this.rightClickedCoordinates != undefined ) {
      this.x = this.rightClickedCoordinates.x;
      this.y = this.rightClickedCoordinates.y;
    }
    
    console.log(this.x + " " + this.y);
  }

}
