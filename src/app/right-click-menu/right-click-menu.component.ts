import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TreeService } from '../tree/tree.service';
import * as $ from 'jquery';
import { QuestionEditComponent } from '../question-edit/question-edit.component';
import { AnswersEditComponent } from '../answers-edit/answers-edit.component';
import { InformationEditComponent } from '../information-edit/information-edit.component';
import{ AppComponent } from '../app.component'
import { nodeValue } from '@angular/core/src/view';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-right-click-menu',
  templateUrl: './right-click-menu.component.html',
  styleUrls: ['./right-click-menu.component.css']
})

export class RightClickMenuComponent implements OnChanges, OnInit  {

  @Input() showContextMenu;
  @Input() rightClickedCoordinates;
  @Input() current_node;
  @Input() clicked_node_children;
  @Output() refreshTree = new EventEmitter();

  subscription: Subscription;
  
  x = 500;
  y = 500;

  constructor(private modalService: NgbModal, private treeService: TreeService, private appComponent: AppComponent) { 
    this.subscription = this.treeService.getMessage().subscribe(message => {
      if(message != undefined) {
          if(message.text == 'open_editor') {
            this.current_node = message.data;
            //this.openEditInformation();
          }  
      }
    });
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {

    $("#nodeContextMenu").on("contextmenu", function(e) {
      return false;
    });

    if( this.rightClickedCoordinates != undefined ) {
      this.x = this.rightClickedCoordinates.x;
      this.y = this.rightClickedCoordinates.y;
    }
  }

  openEditInformation() {
    const modalRef = this.modalService.open(InformationEditComponent, { windowClass : "huge-modal"});
    modalRef.componentInstance.node = this.current_node;
  }

}
