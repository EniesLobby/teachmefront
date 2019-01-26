import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreeService } from '../tree/tree.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.css'],
  providers: [NgbActiveModal]
})

export class StudentViewComponent implements OnInit {

  subscription: Subscription;
  studentForm: FormGroup;
  rootId: string = "";
  treeIsReady: boolean = false;
  treeData: any;
  information: any;
  pageNumber: number;
  children: any;
  questionType: string = "Loading ...";
  generalInformation = [];
  currentQuestion: string = "How to cook babies";
  title: string = "";
  currentInformation: any;
  sisStack = [];
  gisStack = [];
  previousNodeId = [];
  mainArray = [];
  finish: boolean = false;
  typeButtons: boolean = true;
  typeCheckbox: boolean = false;
  multiAnswers = [];

  @Input() demoMode: boolean = false;
  @Input() demoNodeId: any;

  showBackButton: boolean = true;
  finalView: boolean = false;


  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private treeService: TreeService, private route: ActivatedRoute) { 
    this.createForm();
    this.subscription = this.treeService.getMessage().subscribe(message => {
        
      if(message != undefined) {
        
          if(message.text == 'view_add_information_button') {
  
          }
      }
    });
  }

  private createForm() {
    this.studentForm = this.formBuilder.group(
      {

      });
  }

  ngOnInit() {

    this.rootId = this.route.snapshot.queryParamMap.get('tree');

    console.log(this.demoMode);

    if(this.demoMode) {
      this.rootId = this.demoNodeId;
    }

    if(this.rootId == "") {
      
      this.treeIsReady = false;
    } else {
      this.getNode(this.rootId);
      console.log("this.questionType", this.questionType);

      this.getChildren(this.rootId);
      this.getInformation(this.rootId);
      this.getGeneralInformation(this.rootId);
    }
  }

  refreshView(nodeId: string) {

    this.rootId = nodeId;

    this.getNode(this.rootId);
    console.log("this.questionType", this.questionType);

    this.getChildren(this.rootId);
    this.getInformation(this.rootId);
    this.getGeneralInformation(this.rootId);
  }

  goBack() {
     
    this.refreshView(this.previousNodeId.pop());
    this.gisStack.pop();
    this.sisStack.pop();
  }

  constructId(arr: any) {
    let str = "";
    if(arr != undefined) {
      for(let i = 0; i < arr.length; i ++ ) {
        str = str + arr[i] + "-";
      }
    }

    return str.slice(0, str.length - 1);
  }

  nextPage() {
    
    let nodeId = this.constructId(this.multiAnswers);

    this.sisStack.push({
      nodeId: nodeId,
      information: this.findInformationByNodeId(nodeId, this.information)
      });
  }

  multiAnswerChoosen(nodeId: any) {
    if(this.multiAnswers.indexOf(nodeId) == -1) {
      this.multiAnswers.push(nodeId);
    } else {
      for(let i = 0; i < this.multiAnswers.length; i ++ ) {
        if(this.multiAnswers[i] == nodeId) {
          this.multiAnswers.splice(i, 1);
        }
      }
    }

    console.log(this.multiAnswers);
  }

  close() {
    this.modalService.dismissAll();
  }

  mainPage() {
    this.refreshView(this.route.snapshot.queryParamMap.get('tree'));
    this.gisStack = [];
    this.sisStack = [];
  }
  
  public getNode(nodeId: any) {

    this.treeService.getNode(nodeId).toPromise().then( data => {

      if(data.length != 0) {
        this.treeData = JSON.parse(data);

        if(this.treeData.nodeId.toString() == this.rootId) {
          
          this.showBackButton = false;
        
        } else {
          
          this.showBackButton = true;
        }

        this.currentQuestion = this.treeData.question;
        this.questionType = this.treeData.questionLabel;
        console.log(this.questionType);
      }
    });
  }

  findInformationByNodeId(nodeId: any, information: any) {
    
    for(let i = 0; i < information.length; i ++ ) {
      if(this.equalStringCheck(information[i].idOfNodes, nodeId)) {
        return information[i].information;
      }
    }

    return "";
  }

  buttonClicked(nodeId: any) {

    this.previousNodeId.push(this.rootId);
    this.refreshView(nodeId);

    this.sisStack.push({
                    nodeId: nodeId,
                    information: this.findInformationByNodeId(nodeId, this.information)
                    });
  }

  getInformation(nodeId: any) {

    this.treeService.getInformation(nodeId).toPromise().then( data => {
      if(data != null ) {
        this.information = data;
        console.log("this.information = ", data, this.rootId);
        for(let i = 0; i < this.information.length; i ++ ) {
        
          
          if(this.equalStringCheck(this.information[i].idOfNodes, this.rootId)) {
            this.currentInformation = this.information[i].information;
          }
        }
      }
    });
  }

  getGeneralInformation(nodeId: any) {
    this.treeService.getInformationOne(nodeId).toPromise().then( data => {
      if(data != null) {
        if(this.title == "") {
          this.title = data.note.replace(/<\/?[^>]+(>|$)/g, "");
        }
        
        this.gisStack.push({ 
            nodeId: nodeId,
            information: this.information
          });
      }
    })
  }

  getChildren(nodeId: any) {

   this.treeService.getChildren(nodeId).toPromise().then( data => {
      this.children = JSON.parse(data);
      console.log(this.children);

      if(this.children.length == 0) {
        this.finish = true;
      } else {
        this.finish = false;
      }
    });
  }

  equalStringCheck(str1: string, str2: string) {

    if(str1.indexOf("-") <= -1) {
      str1 = str1 + "-";
    }

    if(this.rootId.toString().indexOf("-") <= -1) {
      str2 = str2 + "-";
    }

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

  open(content) {

    this.demoMode = true;

    this.modalService.open(content, { 
      windowClass : "huge-modal",
      keyboard: false,
      backdrop: 'static'
    }).result.then((result) => {

    }, (reason) => {
    });
  }
}
