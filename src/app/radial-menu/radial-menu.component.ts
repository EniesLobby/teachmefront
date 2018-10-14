import { Component, OnInit } from '@angular/core';

declare var wheelnav: any;

@Component({
  selector: 'app-radial-menu',
  templateUrl: './radial-menu.component.html',
  styleUrls: ['./radial-menu.component.css']
})
export class RadialMenuComponent implements OnInit {

  showRadialMenu = false;
  x = 100;
  y = 100;

  first_option = "toggle";
  second_option = "hide";
  third_option = "delete";

  constructor() { }

  ngOnInit() {
    this.showRadialMenu = true;

    let piemenu = new wheelnav('piemenu');
    piemenu.clockwise = false;
    piemenu.sliceInitPathFunction = piemenu.slicePathFunction;
    piemenu.initPercent = 0.1;
    piemenu.wheelRadius = piemenu.wheelRadius * 0.83;
    piemenu.createWheel();
    piemenu.setTooltips([null, null, null]);
  }

  showRadialMenuOnClick() {
  }

}
