import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TreeService } from '../tree/tree.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-radial-menu',
  templateUrl: './radial-menu.component.html',
  styleUrls: ['./radial-menu.component.css']
})
export class RadialMenuComponent implements OnInit, OnChanges {
      
  @Input() leftClickedCoordinates;
  @Input() current_node: any;

  showRadialMenu: boolean = false;
  subscription: Subscription;
  toggleSwitcher: boolean = false;

  x: any;
  y: any;

  constructor(private treeService: TreeService) {
    this.subscription = this.treeService.getMessage().subscribe(message => {
      if(message != undefined) {
          if(message.text == 'radial_menu_toggle_off') {
            this.showRadialMenu = false;
          }  
      }
    });
  }
  
  ngOnInit() {

  }

  openEditor() {
    this.treeService.sendMessage("open_editor", this.current_node);
  }

  public toggle() {
    if(this.toggleSwitcher) {

      this.treeService.sendMessage("toggle_on", this.current_node);
    } else {

      this.treeService.sendMessage("toggle_off", this.current_node);
    }
    this.toggleSwitcher = !this.toggleSwitcher;
  }

  about() {

  }

  ngOnChanges(changes: SimpleChanges) {
    $("#nodeContextMenu").on("contextmenu", function(e) {
      return false;
    });

    if( this.leftClickedCoordinates != undefined ) {
      this.x = this.leftClickedCoordinates.x;
      this.y = this.leftClickedCoordinates.y;
      this.showRadialMenu = true;
    } else {
      this.showRadialMenu = false;
    }
  }
}
