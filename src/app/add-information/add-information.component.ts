import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreeService } from '../tree/tree.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-information',
  templateUrl: './add-information.component.html',
  styleUrls: ['./add-information.component.css'],
  providers: [NgbActiveModal]
})
export class AddInformationComponent implements OnInit, OnDestroy {
  
  subscription: Subscription;
  showAddInformationButton: boolean = false;
  showModal: boolean = true;
  selectedEdges = [];
  information: any;
  nodeId: any;
  children = [];
  answersToView = [];
  currentQuestion: String = "";
  informationEditForm: FormGroup;
  node: any;
  
  x = 500;
  y = 500;
  
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public activeModal: NgbActiveModal, private treeService: TreeService) { 
    
    this.createForm();
    this.subscription = this.treeService.getMessage().subscribe(message => {
        if(message != undefined) {
        
        if(message.text == 'view_add_information_button') {
          this.showAddInformationButton = true;
          this.selectedEdges = message.data.selected_edges;
          this.nodeId = message.data.node.id;
          this.node = message.data.node;
          this.currentQuestion = message.data.node.question;
          console.log(this.node);
          this.getChildren();
        }

        if(message.text == 'hide_add_information_button') {
          this.showAddInformationButton = false;
        }

        if(message.text == "button_position") {
          this.x = message.data.x;
          this.y = message.data.y;
        }
      }
    });
  }

  ngOnInit() {
    this.treeService.sendMessage("radial_menu_toggle_off", "");
  }

  ngOnDestroy() {
    this.information = [];
  }

  private createForm() {
    this.informationEditForm = this.formBuilder.group(
      {
        textArea: ""
      });
  }

  async getChildren() {
    await this.treeService.getChildren(this.nodeId).toPromise().then( data => {
      this.children = JSON.parse(data);
      this.setAnswersToView();
    });
  }

  arrToString() {
    let idOfNodes: string = "";
    for(let i = 0; i < this.selectedEdges.length; i ++ ) {
      idOfNodes = idOfNodes + this.selectedEdges[i] + "-";
    }
  
    if(idOfNodes.includes("-")) {
      idOfNodes = idOfNodes.substring(0, idOfNodes.length - 1);
    }

    return idOfNodes;
  }

  addInformation() {
    
    let nodesArr = [];

    for(let i = 0; i < this.selectedEdges.length; i ++ ) {
      nodesArr.push({
        answer: "",
        answerHtml: "",
        id: "331",
        information: "",
        question: "",
        questionHtml: "<p>A</p>",
        questionLabel: "A",
        rootId: "287"
      })
    }

    let idOfNodes = this.arrToString();
    let information_html = this.informationEditForm.value.textArea.replace(/(\r\n\t|\n|\r\t)/gm, "");
    this.treeService.updateInformation(this.nodeId, idOfNodes, "", information_html);
    this.informationEditForm.patchValue({
      textArea: ""
    })
  }

  onInformationChange($event) {

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


  getInformation() {
    this.treeService.getInformation(this.nodeId).toPromise().then( data => {
      this.information = data;
      var idOfNodes = this.arrToString();
      for(var i = 0; i < this.information.length; i ++ ) {
        if(this.equalStringCheck(idOfNodes, this.information[i].idOfNodes)) {
          this.informationEditForm.patchValue({
            textArea: this.information[i].information
          })
        
        }
      }
    });
  }

  setAnswersToView() {

    this.answersToView = [];
    
    console.log(this.children);
    console.log(this.selectedEdges);
    
    for(let i = 0; i < this.children.length; i ++ ) {
      for(let j = 0; j < this.selectedEdges.length; j ++ ) {

        if(this.children[i].nodeId == this.selectedEdges[j]) {
          this.answersToView.push(this.children[i].answer);
        }
      }
    }

    console.log(this.answersToView);
  }

  open(content) {

    this.informationEditForm.patchValue({
      textArea: ""
    })

    this.modalService.open(content, { 
      windowClass : "huge-modal",
      keyboard: false,
      backdrop: 'static'
    }).result.then((result) => {

    }, (reason) => {
    });
    this.getInformation();
  }
}
