import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { TreeService } from '../tree/tree.service';
import { QuillEditorComponent } from 'ngx-quill';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import Quill from 'quill';

@Component({
  selector: 'app-answers-edit',
  templateUrl: './answers-edit.component.html',
  styleUrls: ['./answers-edit.component.css']
})
export class AnswersEditComponent implements OnInit, OnChanges, OnDestroy {

  // To Do:
  // - Add children check

  answersForm: FormGroup;

  @Input() name;
  @Input() node: any;

  children: any;
  current_nodeId: any;
  showTextEditor: boolean = false;
  showDeleteButton: boolean = false;
  showHelper: boolean = true;
  showStartAdd: boolean = true;
  deletionAllowed: boolean = true;
  showDeletionAlert: boolean = false;
  indexForDelete: any;
  
  x: 500;
  y: 500;
  
  subscription: Subscription;
  arrayOfId = [];
  deleteAfterUpdate = [];

  public editorOptions_hidden = {
    toolbar: '.toolbar',
  };
  
  public editorOptions = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike']
    ]
  };

  constructor(private treeService: TreeService, private formBuilder: FormBuilder) {
    this.createForm();
    this.subscription = this.treeService.getMessage().subscribe(message => {
      if(message != undefined) {
        if(message.text == 'submit_answers') {
          this.submitForm();
        }
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): any { }

  public ngOnDestroy(): any {
    
    if(this.deleteAfterUpdate.length == 0) {
      return;
    }

    for(let i = 0; i < this.deleteAfterUpdate.length; i ++ ) {
      
      this.treeService.deleteNode(this.deleteAfterUpdate[i]).subscribe(
        val => {
            console.log("DELETE call successful value returned in body", val);
            this.sendMessage();
        },
        response => {
            console.log("DELETE call in error", response);
        },
        () => {
            console.log("DELETE PUT observable is now completed.");
        });
    }
  }

  public deletionAlert(index) {
    this.showDeletionAlert = true;
    this.indexForDelete = index;
  }

  public closeAlert() {
    this.showDeletionAlert = false;
  }

  public deleteAnswer() {
    let index = this.indexForDelete;
    console.log(index);

    if(this.deletionAllowed) {
      console.log("this.arrayOfId[index]", this.arrayOfId[index]);
      this.treeService.deleteNode(this.arrayOfId[index]).subscribe(
        val => {
            console.log("DELETE call successful value returned in body", val);
            this.sendMessage();
        },
        response => {
            console.log("DELETE call in error", response);
        },
        () => {
            console.log("DELETE PUT observable is now completed.");
        });
  
        this.arrayOfId.splice(index, 1);
        const control = <FormArray>this.answersForm.controls['aliases'];
        control.removeAt(index);
    }
    
    this.closeAlert();
  }

  private createForm() {
    this.answersForm = this.formBuilder.group({
      textArea: "",
      answers: "",
      aliases: this.formBuilder.array([])
    });
  }

  get aliases() {
    return this.answersForm.get('aliases') as FormArray;
  }

  addAlias(value: any) {
    this.aliases.push(this.formBuilder.control(value));
    this.addNewAnswer();
  }

  ngOnInit() {
    this.getChildren();
    this.answersForm = this.formBuilder.group({
        textArea: this.node.question,
        answers: "",
        aliases: this.formBuilder.array([])
      });
  }

  async getChildren() {

    if(this.node.id != undefined) {
      await this.treeService.getChildren(this.node.id).toPromise().then( data => {
        this.children = JSON.parse(data);
        if(this.children.length != 0) {
          this.showStartAdd = false;
        }
      });
      
      for(let i = 0; i < this.children.length; i ++ ) {
        this.aliases.push(this.formBuilder.control(this.children[i].answer));
        this.arrayOfId.push(this.children[i].nodeId);
      }

    }
  }

  sendMessage(): void {
    this.treeService.sendMessage('refresh', null);
  }

  onChange(index) {
/**     
    let createNewAnswer: boolean = true;

    for(let i = 0; i < this.answersForm.value.aliases.length; i ++ ) {
      if(this.answersForm.value.aliases[i] == "") {
        createNewAnswer = false;
      }
    }

    if(createNewAnswer) {
      this.addAlias("");
      this.deleteAfterUpdate.push(this.current_nodeId);
    }
*/
    let rebuild = this.answersForm.value.aliases[index].replace("\"", "\\\"");
    this.refreshChild(this.arrayOfId[index], rebuild);
  }

  refreshChild(current_nodeId: number, html) {
    
    for(let i = 0; i < this.children.length; i ++ ) {
      if( this.children[i].nodeId == current_nodeId) {
        this.children[i].answer = html.replace(/<[^>]*>/g, '');;
        this.children[i].answerHtml = html;
      }
    }
  }

  submitForm() {

    this.node.question = this.answersForm.value.textArea;
    for(let i = 0; i < this.children.length; i ++ ) {
      if(this.children[i].answer != "") {
        this.treeService.EditNode(this.children[i], "nodeId").subscribe(
          val => {
              console.log("PUT call successful value returned in body", val);
              this.sendMessage();
          },
          response => {
              console.log("PUT call in error", response);
          },
          () => {
              console.log("The PUT observable is now completed.");
          });
      }
    }
    
    this.sendMessage();
  }

  addNewAnswer() {

    this.showTextEditor = true;

    let new_node = {
      question: "",
      questionHtml: "",
      questionLabel: "",
      answer: "",
      answerHtml: "",
      information: "",
      rootId: this.node.rootId
    }

    this.treeService.AddNode(new_node, this.node.id).then(res => {
      this.children.push({
        nodeId: String(res),
        question: "",
        questionHtml: "",
        questionLabel: "",
        answer: "",
        answerHtml: "",
        information: "",
        rootId: this.node.rootId
      });

      this.current_nodeId = res;
      this.sendMessage();
      this.arrayOfId.push(String(res));
    });
  }

}
