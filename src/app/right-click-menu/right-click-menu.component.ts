import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { QuestionEditComponent } from '../question-edit/question-edit.component';
import { AnswersEditComponent } from '../answers-edit/answers-edit.component';
import { InformationEditComponent } from '../information-edit/information-edit.component';
import{ AppComponent } from '../app.component'
import { nodeValue } from '@angular/core/src/view';

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
  
  x = 500;
  y = 500;

  constructor(private modalService: NgbModal, private appComponent: AppComponent) { }

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

  openEditQuestion() {
    const modalRef = this.modalService.open(QuestionEditComponent);
    modalRef.componentInstance.node = this.current_node;
    this.appComponent.hideContextMenu(false);
  }

  openEditAnswers() {
    const modalRef = this.modalService.open(AnswersEditComponent);
    modalRef.componentInstance.node = this.current_node;
    modalRef.componentInstance.children = this.clicked_node_children;
    this.appComponent.hideContextMenu(false);
    this.refreshTree.emit(true)
  }

  openEditInformation() {
    const modalRef = this.modalService.open(InformationEditComponent, { windowClass : "myCustomModalClass"});
    modalRef.componentInstance.node = this.current_node;
    this.appComponent.hideContextMenu(false);
  }

}
