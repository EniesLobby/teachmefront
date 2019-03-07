import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TreeService } from '../tree/tree.service';
import { QuillEditorComponent } from 'ngx-quill';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import Quill from 'quill';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-node-editor',
  templateUrl: './node-editor.component.html',
  styleUrls: ['./node-editor.component.css']
})
export class NodeEditorComponent implements OnInit, OnDestroy {

  nodeEditForm: FormGroup;
  @Input() name;
  @Input() node: any;
  questionHtml: any;
  question: any;
  children: any;
  treeData: any;
  clickedId: any;
  selectedNodes = [];
  showMessage: true;
  information: any; // Array with all information
  currentClickedId: string = "";
  showTextEditor: boolean = false;
  showQuestionClickedMessage: boolean = false;
  subscription: Subscription;
  answerstoShow = [];
  labelsToShow = [];
  generalInformation: any;
  question_edit: string = "";
  showGeneralInformatonEditor: boolean = false;
  arrayOfId = [];
  deleteAfterUpdate = [];
  current_nodeId: any;
  showDeleteButton: boolean = false;
  showHelper: boolean = true;
  showStartAdd: boolean = true;
  deletionAllowed: boolean = true;
  showDeletionAlert: boolean = false;
  indexForDelete: any;
  answersToDeleteAfter = [];
  dropDownValue: String = "Choose question style ..."
  questionType: String = "buttons"

  public editorOptions_hidden = {
    toolbar: '.toolbar',
  };
  
  public editorOptions = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike']
    ]
  };

  constructor(config: NgbModalConfig, public activeModal: NgbActiveModal, private treeService: TreeService, private formBuilder: FormBuilder) {

    this.createForm();
    
    config.keyboard = false;
    config.backdrop = 'static';
  }

  ngOnInit() {

    this.getChildren();
    this.treeService.sendMessage("radial_menu_toggle_off", "");
    this.setQuestionTypeValue();

    this.treeService.getInformation(this.node.id).toPromise().then( data => {
      this.information = data;

      if(typeof data[0] != "undefined" ) {
        this.currentClickedId = data[0].idOfNodes;
      }

      if(this.information != undefined) {
        for(var i = 0; i < this.information.length; i ++ ) {
          if(this.information[i].idOfNodes == String(this.node.id)) {
            this.generalInformation = this.information[i].information;
            this.nodeEditForm.patchValue({
              questionGeneralInformation: this.information[i].information
            })
          }
        }
      }
    });

    this.nodeEditForm = this.formBuilder.group(
      {
        questionEdit: this.node.question,
        questionGeneralInformation: "",
        aliases: this.formBuilder.array([])
      }); 

    if(this.node.question == "") {
      this.showGeneralInformatonEditor = false;
    } else {
      this.showGeneralInformatonEditor = true;
    }

    this.setTreeData();
  }

  public setQuestionTypeValue() {

    let labelKeyValue = {
      "": "Choose question style ...",
      "check_box": "Check Boxes (multianswers)",
      "button": "Buttons"
    };

    if(this.node != undefined) {
      console.log(this.dropDownValue)
      this.dropDownValue = labelKeyValue[this.node.questionLabel];
    }
  }
 
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

  public setTreeData() {
    
    let d = [];
    if(this.node.id != undefined) {
      this.treeService.getChildren(this.node.id).toPromise().then( data => {
        //this.children = JSON.parse(data);
      });
    }
  }

  public checkCheckBoxes() {

    this.dropDownValue = "Check Boxes (multianswers)";
    this.questionType = "check_box";
  }

  public checkButtons() {

    this.dropDownValue = "Simple buttons"
    this.questionType = "button";
  }

  private createForm() {
    
    this.nodeEditForm = this.formBuilder.group(
      {
        questionEdit: "",
        questionGeneralInformation: "",
        aliases: this.formBuilder.array([])
      });
  }

  sendMessage(): void {
    
    this.treeService.sendMessage('refresh', null);
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
        const control = <FormArray>this.nodeEditForm.controls['aliases'];
        control.removeAt(index);
    }
    
    this.closeAlert();
  }

  get aliases() {
    
    return this.nodeEditForm.get('aliases') as FormArray;
  }

  addAlias(value: any) {
    
    this.aliases.push(this.formBuilder.control(value));
    this.addNewAnswer();
  }

  refreshChild(current_nodeId: number, html) {
    
    for(let i = 0; i < this.children.length; i ++ ) {
      if( this.children[i].nodeId == current_nodeId) {
        this.children[i].answer = html.replace(/<[^>]*>/g, '').replace(/\\t/g, '');
        this.children[i].answerHtml = html;
      }
    }
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

  onAnswerChange(index) {
    
    /** */    
    let createNewAnswer: boolean = true;

    for(let i = 0; i < this.nodeEditForm.value.aliases.length; i ++ ) {
      if(this.nodeEditForm.value.aliases[i] == "") {
        createNewAnswer = false;
      }
    }

    if(createNewAnswer) {
      this.aliases.push(this.formBuilder.control(""));

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

        this.answersToDeleteAfter.push(String(res));
  
        this.current_nodeId = res;
        this.sendMessage();
        this.arrayOfId.push(String(res));
      });
    }

    let rebuild = "";
    if(this.nodeEditForm.value.aliases[index] != null) {
      rebuild = this.nodeEditForm.value.aliases[index].replace("\"", "\\\"").replace(/\\t/g, '');
    }
    this.refreshChild(this.arrayOfId[index], rebuild);
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

      let createNewAnswer: boolean = true;

      for(let i = 0; i < this.nodeEditForm.value.aliases.length; i ++ ) {
        if(this.nodeEditForm.value.aliases[i] == "") {
          createNewAnswer = false;
        }
      }
  
      if(createNewAnswer) {
        this.aliases.push(this.formBuilder.control(""));
      }

    }
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
    this.node.questionLabel = this.questionType;

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

  public async submitForm() {
    
    this.updateQuestion();
    
    this.treeService.sendMessage("submit_question", "");

    for(let i = 0; i < this.children.length; i ++ ) {
      for(let j = 0; j < this.answersToDeleteAfter.length; j ++ ) {
        if(this.children[i].nodeId == this.answersToDeleteAfter[j]) {
          if(this.children[i].asnwer == "") {
            this.children.splice(i, 1);
          }
        }
      }
    }
   
    this.node.question = this.nodeEditForm.value.textArea;
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
    
    this.activeModal.close();
  }

}
