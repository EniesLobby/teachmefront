import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

declare var wheelnav: any;

@Component({
  selector: 'app-radial-menu',
  templateUrl: './radial-menu.component.html',
  styleUrls: ['./radial-menu.component.css']
})
export class RadialMenuComponent implements OnChanges, OnInit {

  @Input() showRadialMenu;
  @Input() leftClickedCoordinates;
  
  x = 100;
  y = 100;

  first_option = "toggle";
  second_option = "hide";
  third_option = "delete";

  constructor() { }

  ngOnInit() {
    if(this.showRadialMenu && this.showRadialMenu) {
      console.log("AEAEAE")
      this.x = this.leftClickedCoordinates.x;
      this.y = this.leftClickedCoordinates.y;

      let piemenu = new wheelnav('piemenu');
      piemenu.clockwise = false;
      piemenu.sliceInitPathFunction = piemenu.slicePathFunction;
      piemenu.initPercent = 0.1;
      piemenu.wheelRadius = piemenu.wheelRadius * 0.83;
      piemenu.createWheel();
      piemenu.setTooltips([null, null, null]);
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if( this.leftClickedCoordinates != undefined && this.showRadialMenu ) {
      console.log("AEAEAE")
      this.x = this.leftClickedCoordinates.x;
      this.y = this.leftClickedCoordinates.y;

      let piemenu = new wheelnav('piemenu');
      piemenu.clockwise = false;
      piemenu.sliceInitPathFunction = piemenu.slicePathFunction;
      piemenu.initPercent = 0.1;
      piemenu.wheelRadius = piemenu.wheelRadius * 0.83;
      piemenu.createWheel();
      piemenu.setTooltips([null, null, null]);
    }
  }

}
