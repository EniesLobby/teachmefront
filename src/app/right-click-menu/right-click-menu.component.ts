import { Component, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { unwatchFile } from 'fs';

@Component({
  selector: 'app-right-click-menu',
  templateUrl: './right-click-menu.component.html',
  styleUrls: ['./right-click-menu.component.css']
})
export class RightClickMenuComponent implements OnChanges  {

  @Input() showContextMenu;
  @Input() rightClickedCoordinates;
  
  x = 500;
  y = 500;

  constructor() { }

  ngOnChanges (changes: SimpleChanges) {

    if( this.rightClickedCoordinates != undefined ) {
      this.x = this.rightClickedCoordinates.x;
      this.y = this.rightClickedCoordinates.y;
    }
    console.log(this.showContextMenu);
    
    console.log(this.x + " " + this.y);
  }

}
