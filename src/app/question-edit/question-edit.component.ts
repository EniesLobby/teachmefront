import { Component, OnInit, Input } from '@angular/core';
import { TreeService } from '../tree/tree.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import Quill from 'quill';
import { Subscription } from 'rxjs';

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
  information: any;
  generalInformation: any;
  children: any;
  subscription: Subscription;
  label_helper: string = "";
  question_edit: string = "";
  showGeneralInformatonEditor: boolean = false;

  constructor(private treeService: TreeService, private formBuilder: FormBuilder) {
    this.createForm();
    this.subscription = this.treeService.getMessage().subscribe(message => {
      if(message != undefined) {
        if(message.text == 'submit_answers') {
          this.updateQuestion();
        }
      }
    });
  }


  private createForm() {
    this.questionEditForm = this.formBuilder.group(
      {
        textArea: "",
        questionLabel: "",
        questionGeneralInformation: ""
      });
  }

  ngOnInit() {

    this.questionEditForm = this.formBuilder.group(
      {
        textArea: this.node.question,
        questionLabel: this.node.questionLabel,
        questionGeneralInformation: ""
      }); 

    if(this.node.question == "") {
      this.showGeneralInformatonEditor = false;
    } else {
      this.showGeneralInformatonEditor = true;
    }

    this.treeService.getInformation(this.node.id).toPromise().then( data => {
      this.information = data;

      if(this.information != undefined) {
        for(var i = 0; i < this.information.length; i ++ ) {
          if(this.information[i].idOfNodes == String(this.node.id)) {
            this.generalInformation = this.information[i].information;
            this.questionEditForm.patchValue({
              questionGeneralInformation: this.information[i].information
            })
          }
        }
      }
      console.log("this.information", this.generalInformation);
    });

    this.setTreeData();

    this.onLabelChanges();
  }

  public setTreeData() {
    
    let d = [];
    if(this.node.id != undefined) {
      this.treeService.getChildren(this.node.id).toPromise().then( data => {
        this.children = JSON.parse(data);
      });
    }
  }

  updateTree(): void {
    this.treeService.sendMessage('refresh', null);
  }

  onChangeQuestion($event) {
    this.questionHtml = $event.html;
    this.question = $event.text;
    if($event.text == "") {
      this.showGeneralInformatonEditor = false;
    } else {
      this.showGeneralInformatonEditor = true;
    }
  }

  onChangeGeneralInformation($event) {
    this.generalInformation = $event.html;
    this.updateGeneralQuestion();
  }

  async updateGeneralQuestion() {
    await this.treeService.updateInformation( this.node.id, String(this.node.id), "", this.generalInformation);
  }

  updateQuestion() {

    if( this.question == undefined ) {
      this.question = this.node.question;
    }

    if( this.questionHtml == undefined) {
      this.questionHtml = this.node.questionHtml;
    }

    // preserve newlines, etc - use valid JSON
    this.question = this.question.replace(/\\n/g, "\\n")  
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, "\\&")
    .replace(/\\r/g, "\\r")
    .replace(/\\t/g, "")
    .replace(/\\b/g, "")
    .replace(/\\f/g, "");
    // remove non-printable and other non-valid JSON chars
    this.question = this.question.replace(/[\u0000-\u0019]+/g,"");

    // preserve newlines, etc - use valid JSON
    this.questionHtml = this.questionHtml.replace(/\\n/g, "\\n")  
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, "\\&")
    .replace(/\\r/g, "\\r")
    .replace(/\\t/g, "")
    .replace(/\\b/g, "")
    .replace(/\\f/g, "");
    
    // remove non-printable and other non-valid JSON chars
    this.question = this.question.replace(/[\u0000-\u0019]+/g,"");
    
    this.question = this.question.replace(/(\r\n\t|\n|\r\t)/gm,"");
    this.questionHtml = this.questionHtml.replace(/(\r\n\t|\n|\r\t)/gm,"");

    this.node.question = this.question;
    this.node.questionHtml = this.questionHtml;
    this.node.questionLabel = this.questionEditForm.value.questionLabel;

    this.treeService.EditNode(this.node, null).subscribe(
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
  }


}
