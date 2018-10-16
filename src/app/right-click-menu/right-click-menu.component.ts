import { Component, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { QuestionEditComponent } from '../question-edit/question-edit.component';

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

  constructor(private modalService: NgbModal) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

    $("#nodeContextMenu").on("contextmenu", function(e) {
      return false;
    });

    if( this.rightClickedCoordinates != undefined ) {
      this.x = this.rightClickedCoordinates.x;
      this.y = this.rightClickedCoordinates.y;
    }
  }

  open() {
    const modalRef = this.modalService.open(QuestionEditComponent);
    modalRef.componentInstance.name = 'World';
  }

}
