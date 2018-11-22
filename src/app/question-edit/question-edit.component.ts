import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TreeService } from '../tree/tree.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import Quill from 'quill';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.css']
})

export class QuestionEditComponent implements OnInit {

  questionEditForm: FormGroup;
  @Input() node: any;

  questionHtml: any;
  question: any;

  label_helper: string = "";
  question_edit: string = "";

  constructor(public activeModal: NgbActiveModal, private treeService: TreeService, private formBuilder: FormBuilder) {
    this.createForm();
  }


  private createForm() {
    this.questionEditForm = this.formBuilder.group(
      {
        textArea: "",
        questionLabel: ""
      });
  }

  ngOnInit() {
    this.questionEditForm = this.formBuilder.group(
      {
        textArea: this.node.question,
        questionLabel: this.node.questionLabel
      }); 

    this.onLabelChanges();
  }

  updateTree(): void {
    this.treeService.sendMessage('refresh', null);
  }

  onChange($event) {
    this.questionHtml = $event.html;
    this.question = $event.text;

    this.updateQuestion();
  }

  updateQuestion() {

    if( this.question == undefined ) {
      this.question = this.node.question;
    }

    if( this.questionHtml == undefined) {
      this.questionHtml = this.node.questionHtml;
    }
    
    this.question = this.question.replace(/(\r\n\t|\n|\r\t)/gm,"");
    this.questionHtml = this.questionHtml.replace(/(\r\n\t|\n|\r\t)/gm,"");

    this.node.question = this.question;
    this.node.questionHtml = this.questionHtml;
    this.node.questionLabel = this.questionEditForm.value.questionLabel;

    console.log("node", this.node);
    console.log("AEAEAEAEAE", this.questionEditForm.value.questionLabel);

    this.treeService.EditNode(this.node).subscribe(
      val => {
          console.log("POST call successful value returned in body", val);
          this.updateTree();
      },
      response => {
          console.log("POST call in error", response);
      },
      () => {
          console.log("The POST observable is now completed.");
      }
    );
  }

  onLabelChanges(): void {
    this.questionEditForm.valueChanges.subscribe(val => {
      console.log(val);
      this.updateQuestion();
    });
  }


}
