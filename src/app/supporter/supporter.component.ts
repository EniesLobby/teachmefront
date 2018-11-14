import { Component, OnInit, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { EventEmitter } from 'events';
import { TreeService } from '../tree/tree.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-supporter',
  templateUrl: './supporter.component.html',
  styleUrls: ['./supporter.component.css']
})
export class SupporterComponent implements OnChanges {

  @Input() node_for_right_menu;
  @Input() node_present = false;
  children: any;
  label = "question";
  answer_off_or_on: boolean = true;
  toggleSwitcher: boolean = true;

  supporterForm: FormGroup;

  constructor(private treeService: TreeService, private formBuilder: FormBuilder) {     
    this.createForm();
  }
  private createForm() {
    this.supporterForm = this.formBuilder.group({
      setLabelForm: ""
    });
  }

  ngOnInit() {
    this.supporterForm = this.formBuilder.group({
      setLabelForm: ""
    });
  }

  onChange($event) {
    this.treeService.sendMessage("label", $event);
  }

  ngOnChanges(changes: SimpleChanges) {

    if(this.node_for_right_menu != undefined) {
      this.node_present = true;
      console.log("node_for_right_menu", this.node_for_right_menu);
      if(this.node_for_right_menu.question == "") {
        this.node_for_right_menu = [
          {
            "answer": "answers are empty",
            "question": "question is empty"
          }
        ]
      }
    } else {
      this.node_for_right_menu = [
        {
          "answer": "answers are empty",
          "question": "question is empty"
        }
      ]
    }

    this.getChildren();
  }

  public deleteNode() {
    this.treeService.deleteNode(this.node_for_right_menu.id);
    this.treeService.sendMessage("refresh", null);
  }

  public toggleChildren() {
    this.treeService.clearMessage();
    this.toggleSwitcher = !this.toggleSwitcher;
    if(this.toggleSwitcher) {
      this.treeService.sendMessage("toggle_on", this.node_for_right_menu);
    } else {
      this.treeService.sendMessage("toggle_off", this.node_for_right_menu);
    }
  }

  public setLabel() {
    this.treeService.clearMessage();
    this.treeService.sendMessage("label", this.label);
  }

  public setQuestionLabel() {
    this.label = "question";
    this.treeService.sendMessage("label", this.label);
  }

  public setAnswerLabel() {
    this.answer_off_or_on = !this.answer_off_or_on;

    if(this.answer_off_or_on) {
      this.label = "answer_on";
    }
    else {
      this.label = "answer_off";
    }

    this.treeService.sendMessage("label", this.label);
  }

  public setQuestionlabelLabel() {
    this.label = "question_label";
    this.treeService.sendMessage("label", this.label);
  }

  public setIdLabel() {
    this.label = "id";
    this.treeService.sendMessage("label", this.label);
  }

  sendMessage(message: string): void {
    let data = [];
    this.treeService.sendMessage(message, data);
  }

  public getChildren() {
    if(this.node_for_right_menu.id != undefined) {
      this.treeService.getChildren(this.node_for_right_menu.id).toPromise().then( data => {
        this.children = JSON.parse(data);
        console.log(this.children);
      });
    }
  }

  public openNav() {
    document.getElementById("mySidenav_right").style.width = "250px";
  }

  public closeNav() {
      document.getElementById("mySidenav_right").style.width = "0";
  }

}
