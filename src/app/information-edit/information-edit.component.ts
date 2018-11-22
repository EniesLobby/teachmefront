import { Renderer, Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TreeService } from '../tree/tree.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import Quill from 'quill';
import * as cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import * as $ from 'jquery'; 


@Component({
  selector: 'app-information-edit',
  templateUrl: './information-edit.component.html',
  styleUrls: ['./information-edit.component.css']
})
export class InformationEditComponent implements OnInit {

  myForm: FormGroup;
  checkForm: FormGroup;

  @Input() name;
  @Input() node: any;

  questionHtml: any;
  question: any;

  children: any;
  treeData: any;

  clickedId: any;
  selectedNodes = [];

  showMessage: true;
  information: any; // Array of all information

  currentClickedId: string = "";
  showTextEditor: boolean = false;
  showQuestionClickedMessage: boolean = false;

  answerstoShow = [];
  labelsToShow = [];

  constructor(private renderer : Renderer, public activeModal: NgbActiveModal, private treeService: TreeService, private formBuilder: FormBuilder) {
    this.createForm();
  }

  private createForm() {
    this.myForm = this.formBuilder.group(
      {
        textArea: ""
      });

    this.checkForm = this.formBuilder.group({

    });
  }

  ngOnInit() {

    this.treeService.getInformation(this.node.id).toPromise().then( data => {
      this.information = data;
      if(typeof data[0] != "undefined" ) {
        this.currentClickedId = data[0].idOfNodes;
      }
    });
  }

  checkFormChanged($event) {
    console.log("check", $event);
  }

  sendMessage(): void {
    this.treeService.sendMessage('refresh', null);
  }

  reverse(str:string) {
    return str.split('').reverse().join('');
  }

  equalStringCheck(str1, str2) {
    // example:
    //   str1 = "21-22-20"
    //   str2 = "20-22-21"

    let first_array = str1.split("-").sort();
    let second_array = str2.split("-").sort();

    if(first_array.length != second_array.length) {
      return false;
    } else {
      for(let i = 0; i < first_array.length; i ++ ) {
        if(first_array[i] != second_array[i]) {
          return false;
        }
      }
    }

    return true
  }

  clickedNode(id) {

    if(id == this.node.id) {
      this.showQuestionClickedMessage = true;
    } else {
      this.showQuestionClickedMessage = false;
    }

    if(this.selectedNodes.length == 0) {
      this.showTextEditor = false;
    } else {
      this.showTextEditor = true;
    }

    this.clickedId = id;

    let multiId: string = "";
    for(let i = 0; i < this.selectedNodes.length; i ++ ) {
      if(this.selectedNodes.length == 1 && this.selectedNodes[0] == this.node.id) {
        multiId = this.selectedNodes[0];
      }

      if(String(this.selectedNodes[i]) != this.node.id) {
        multiId = multiId + this.selectedNodes[i] + "-";
      }
    }

    if(multiId.includes("-")) {
      multiId = multiId.substring(0, multiId.length - 1);
    }
    
    console.log("multiId", multiId);

    this.currentClickedId = multiId;

    let current_information;

    for(let i = 0; i < this.information.length; i ++ ) {
      //if(this.information[i].idOfNodes == multiId || this.information[i].idOfNodes == this.reverse(multiId)) {
        if(this.equalStringCheck(this.information[i].idOfNodes, multiId)) {
        console.log("checked")
        current_information = this.information[i].information;
      }
    }

    this.myForm.patchValue({
      textArea: current_information
    })
  }

  onChange($event) {
  
    var idOfNodes_isFound = false;
    for(let i = 0; i < this.information.length; i ++ ) {
      if(this.information[i].idOfNodes == this.currentClickedId || this.information[i].idOfNodes == this.reverse(this.currentClickedId)) {
        idOfNodes_isFound = true;
        this.information[i].information = $event.html;
      }
    }

    if(!idOfNodes_isFound && this.currentClickedId != "") {
      let newInformation = {
        idOfNodes: this.currentClickedId,
        information: $event.html,
        notes: ""
      }
      this.information.push(newInformation);
    }
  }


  public async submitForm() {
    for(let i = 0; i < this.information.length; i ++ ) {
      await this.treeService.updateInformation( this.node.id, 
                                          this.information[i].idOfNodes, 
                                          this.information[i].notes, 
                                          this.information[i].information);
    }

    this.activeModal.close(this.myForm.value);
  }


}

