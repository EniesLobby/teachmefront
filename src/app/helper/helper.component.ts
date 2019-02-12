import { Component, OnChanges, Renderer, TemplateRef, Input, Output, EventEmitter, Inject, OnInit, Injectable, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreeService } from '../tree/tree.service';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.css'],
  providers: [NgbActiveModal]
})
export class HelperComponent implements OnInit {
  
  subscription: Subscription;
  show_help: boolean = false;
  showHelperProfile: boolean = false;
  showHelperSupporter: boolean = false;
  showHelperRoot: boolean = false;
  helpButton: boolean = true;
  showHelperHelpButton: boolean = true;
  showHelperQuestionEdit: boolean = true;
  profileHelperText: string = "";
  supporterHelperText: string = "";
  rootHelperText: string = "";
  helpButtonHelperText: string = "";
  showHelperQuestionEditText: string ="";
  showTutorial: boolean = false;

  x: any;
  y: any;

  constructor(config: NgbModalConfig, private modalService: NgbModal, 
    private renderer : Renderer, public activeModal: NgbActiveModal, 
    private treeService: TreeService ) {

    config.keyboard = false;
    config.backdrop = 'static';
    
    this.subscription = this.treeService.getMessage().subscribe(message => {
      if(message != undefined) {
        if(message.text == "root_position") {
          this.x = message.data.x;
          this.y = message.data.y;
        }

        if(message.text == "show_help") {
          this.show_help = message.data;
        }

        if(message.text == "showHelperProfile") {
          this.showHelperProfile = message.data;
        }
        
        if(message.text == "showHelperHelpButton") {
          this.showHelperHelpButton = message.data;
        }

        if(message.text == "showHelperQuestionEdit") {
          this.showHelperQuestionEdit = message.data;
        }

      }
    });
  }

  startTutorial() {

  }

  ngOnInit() {

    //this.open(NgbdModal2Content);
    this.profileHelperText = "Here you can manage your trees:<br /> <b>delete</b>, <b>create</b> or <b>rename</b> them!.";
    this.rootHelperText = "This is root node of the tree. Click on the node to <ul><li>change question</li><li>manage answers</li><li>manage description</li>"
    this.helpButtonHelperText = "Click on the help to activate supporting messages"
    
    $(document).ready(function(){
      $('#popup_visibility').hide();
      $('#popup_tutorial').hide();   

      $(".button-text.visibility, #popup_visibility").hover(function() {
          $('#popup_visibility').show('slow')
      },function() {
              setTimeout(function() {
              if(!($('#popup_visibility:hover').length > 0))
                  $('#popup_visibility').hide('slow');
              }, 300);
          });
      
      $(".button-text.tutorial, #popup_tutorial").hover(function() {
        $('#popup_tutorial').show('slow')
        },function() {
                setTimeout(function() {
                if(!($('#popup_tutorial:hover').length > 0))
                    $('#popup_tutorial').hide('slow');
                }, 300);
            });  
      });
  }

  helpButtonClick() {

    this.treeService.sendMessage("refresh", null);
    this.showHelperProfile = !this.showHelperProfile;
    this.helpButton = true;
    this.showHelperHelpButton = true;
    this.showHelperRoot = !this.showHelperRoot;
  }

  open(content) {

    this.modalService.open(content, { 
      windowClass : "huge-modal"
    }).result.then((result) => {

    }, (reason) => {
    });
  }

}

@Component({
  template: `
    <div class="modal-header">
      <h4>Tutorial</h4>
    </div>
    <div class="modal-body">
      ae
      
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary">
        Next
      </button>
    </div>
  `
})
export class NgbdModal2Content {
  constructor(public activeModal: NgbActiveModal) {}
  showTutorial: false;
}
