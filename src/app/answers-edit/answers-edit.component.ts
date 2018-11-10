import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TreeService } from '../tree/tree.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import Quill from 'quill';

@Component({
  selector: 'app-answers-edit',
  templateUrl: './answers-edit.component.html',
  styleUrls: ['./answers-edit.component.css']
})
export class AnswersEditComponent implements OnInit {

  answersForm: FormGroup;

  @Input() name;
  @Input() node: any;
  @Input() children: any;

  current_nodeId: any;
  showTextEditor: boolean = false;
  showDeleteButton: boolean = false;

  constructor(public activeModal: NgbActiveModal, private treeService: TreeService, private formBuilder: FormBuilder) {
    this.createForm();
  }

  public deleteAnswer() {
    console.log("delete current_nodeId", this.current_nodeId);
  }

  private createForm() {
    this.answersForm = this.formBuilder.group({
      textArea: "",
      answers: "", 
      exampleRadios: "",
      exampleSelect: ""
    });
  }

  ngOnInit() {
    this.answersForm = this.formBuilder.group({
        textArea: this.node.question,
        answers: "", 
        exampleRadios: "",
        exampleSelect: ""
      });

    console.log(this.children);
    console.log(this.node)
  }

  sendMessage(): void {
    this.treeService.sendMessage('refresh', null);
  }

  close() {
    this.sendMessage();
    this.activeModal.close(this.answersForm.value);
  }

  onChange($event) {
    this.showTextEditor = true;

    if($event != undefined) {
      this.showDeleteButton = true;
    } else {
      this.showDeleteButton = false;
    }

    console.log($event)

    if($event == undefined) {
      $event = this.current_nodeId;
    }

    if(typeof($event) == 'number' || typeof($event) == 'string' ) {
      this.current_nodeId = null;
      console.log("onchange id = " + $event)
      console.log(this.children)

      let answer;
      for(let i = 0; i < this.children.length; i ++ ) {
        if( this.children[i].id == $event ) {
          answer = this.children[i].answerHtml
        }
      }

      console.log("answer = " + answer);

      this.answersForm.patchValue({
        textArea: answer
      })

      this.current_nodeId = $event;
    } else if($event != undefined) {
      this.refreshChild(this.current_nodeId, $event)
    }
  }

  submitForm() {
    
    this.node.question = this.answersForm.value.textArea;
    
    for(let i = 0; i < this.children.length; i ++ ) {
      this.treeService.EditNode(this.children[i]).subscribe(
        val => {
            console.log("PUT call successful value returned in body", val);
            this.sendMessage();
        },
        response => {
            console.log("PUT call in error", response);
        },
        () => {
            console.log("The PUT observable is now completed.");
        }
    );;
    }

    this.activeModal.close(this.answersForm.value);
    this.sendMessage();
  }

  refreshChild(current_nodeId: number, $event) {
    for(let i = 0; i < this.children.length; i ++ ) {
      if( this.children[i].id == current_nodeId) {
        this.children[i].answer = $event.text;
        this.children[i].answerHtml = $event.html;
      }
    }
  }
  
  addNewAnswer() {
    
    this.showTextEditor = true;

    let new_node = {
      question: "",
      questionHtml: "",
      questionLabel: "",
      answer: "New Answer",
      answerHtml: "<p>New Answer</p>",
      information: "",
      rootId: this.node.rootId
    }

    let id;
    this.treeService.AddNode(new_node, this.node.id).then(res => {
      console.log("res = " + res);
      this.children.push({
        id: String(res),
        question: "",
        questionHtml: "",
        questionLabel: "",
        answer: "New Answer",
        answerHtml: "<p>New Answer</p>",
        information: "",
        rootId: this.node.rootId
      });
      this.current_nodeId = res;
      this.answersForm.patchValue({
          answers: String(res),
          textArea: "<p>New Answer</p>"
        });
      this.sendMessage();
    });

    console.log(this.children);
  }

  

}
