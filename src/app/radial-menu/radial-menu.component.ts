import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TreeService } from '../tree/tree.service';

declare var wheelnav: any;

@Component({
  selector: 'app-radial-menu',
  templateUrl: './radial-menu.component.html',
  styleUrls: ['./radial-menu.component.css']
})
export class RadialMenuComponent implements OnInit, OnChanges {
      
  @Input() leftClickedCoordinates;
  
  x: any;
  y: any;

  constructor(private treeService: TreeService) {
  }
  
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    $("#nodeContextMenu").on("contextmenu", function(e) {
      return false;
    });

    if( this.leftClickedCoordinates != undefined ) {
      this.x = this.leftClickedCoordinates.x;
      this.y = this.leftClickedCoordinates.y;
    }
  }

  toggleClick() {
    this.treeService.sendMessage("toggle", "Ae");
  }


}
