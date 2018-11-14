import { Component, OnChanges, Renderer, ElementRef, Input, Output, EventEmitter, Inject, OnInit, Injectable, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreeService } from '../tree/tree.service';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.css']
})
export class HelperComponent implements OnInit {
  
  subscription: Subscription;
  show_help: boolean = true;
  showHelperProfile: boolean = true;
  showHelperSupporter: boolean = true;
  showHelperRoot: boolean = false;
  helpButton: boolean = true;
  showHelperHelpButton: boolean = true;

  profileHelperText: string = "";
  supporterHelperText: string = "";
  rootHelperText: string = "";
  helpButtonHelperText: string = "";

  x;
  y;

  constructor(private treeService: TreeService) { 
    this.subscription = this.treeService.getMessage().subscribe(message => {
      if(message != undefined) {
        if(message.text == "root_position") {
          this.x = message.data.x;
          this.y = message.data.y;
          this.showHelperRoot = true;
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

      }
    });
  }

  ngOnInit() {
    this.profileHelperText = "Here you can manage your profile. Currently only creation of the tree is active.";
    this.supporterHelperText = "This window will show you information about clicked node. You can delete node or toggle its children."
    this.rootHelperText = "This is root node of the tree. To start right click on the tree, change question and add some answers!"
    this.helpButtonHelperText = "Here you can get tutorials and activate help"
    
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
    this.showHelperProfile = true;
    this.showHelperSupporter = true;
    this.helpButton = true;
    this.showHelperHelpButton = true;

    if(this.x != undefined && this.y != undefined) {
      this.showHelperRoot = true;
    }
  }


}
