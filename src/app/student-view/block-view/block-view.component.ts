import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreeService } from '../../tree/tree.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-block-view',
  templateUrl: './block-view.component.html',
  styleUrls: ['./block-view.component.css'],
  providers: [NgbActiveModal]
})
export class BlockViewComponent implements OnInit {

  subscription: Subscription;
  studentForm: FormGroup;
  startRootId: any;
  currentNodeData: any;
  currentChildrenData: any;
  multiAnswers = [];
  finish: boolean = false;
  showButton: boolean = true;
  nextReady: boolean = true;
  information = [];

  @Input() sisStackBlock = [];
  @Input() gisStackBlock = [];
  
  @Input() showPrevious: boolean = true;
  @Input() nextClicked: boolean = false;
  @Input() finalObject = [];
  @Input() nodeId: any;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private treeService: TreeService, private route: ActivatedRoute) { 
    this.createForm();
    this.subscription = this.treeService.getMessage().subscribe(message => {
        
      if(message != undefined) {
        
          if(message.text == 'view_add_information_button') {
  
          }
      }
    });
  }

  ngOnInit() {

    this.treeService.sendMessage("started", null);

    if(this.multiAnswers.length == 0) {
      this.nextReady = false;
    } else {
      this.nextReady = true;
    }

    this.nextClicked = false;
    this.multiAnswers = [];

    let constructedId = this.constructId(this.nodeId);

    this.treeService.getSpecificInformation(constructedId).toPromise().then( data => {
      console.log("HUY SRABOTAET", constructedId )
      if(data != null ) {
        console.log("HUY SRABOTAET", data)
        this.sisStackBlock.push(data.information);
      }
    });


    for(let i = 0; i < this.nodeId.length; i ++) {
      this.getNode(this.nodeId[i]);
    }

    console.log("showPrevious", this.showPrevious);
  }

  private createForm() {
    this.studentForm = this.formBuilder.group(
      {

      });
  }

  homePage() {
    window.location.reload();
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

  findInformationByNodeId(nodeId: any, information: any) {
    
    for(let i = 0; i < information.length; i ++ ) {
      if(this.equalStringCheck(information[i].idOfNodes, nodeId)) {
        return information[i].information;
      }
    }

    return "";
  }

  public getNode(nodeId: any) {

    this.treeService.getNode(nodeId).toPromise().then( data => {
      if(data != "") {

        console.log("getNode", data);
        var nodeData = JSON.parse(data);
      
        this.treeService.getChildren(nodeId).toPromise().then( data => {
          var childData = JSON.parse(data);
  
          if(childData.length == 0) {

          }
  
          this.treeService.getInformation(nodeId).toPromise().then( data => {
            if(data != "" ) {
              var information: any;
              information = data;
              var currentInformation;

              for(let i = 0; i < information.length; i ++ ) {
                 
                if(this.equalStringCheck(information[i].idOfNodes, nodeId)) {
                  currentInformation = information[i].information;
                }
              }

              this.gisStackBlock.push(currentInformation);
              
              this.finalObject.push({
                information: currentInformation,
                node: nodeData,
                children: childData
              })
        
              console.log("this.fn", this.finalObject);
            }
          });
        });
      } else {

      }
    });
  }

  equalStringCheck(str1: string, str2: string) {

    if(str1.indexOf("-") <= -1) {
      str1 = str1 + "-";
    }

    if(str2.toString().indexOf("-") <= -1) {
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

    if(this.multiAnswers.length == 0) {
      this.nextReady = false;
    } else {
      this.nextReady = true;
    }

    console.log(this.multiAnswers);
  }

  nextPage() {
    this.showButton = false;
    this.nextClicked = true;
    this.showPrevious = false;
    this.treeService.sendMessage("started_minus", null);
  }


}
