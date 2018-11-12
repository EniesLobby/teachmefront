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
      if(typeof data[0] != "undefined" ){
        this.currentClickedId = data[0].idOfNodes;
      }
    });

    this.setTreeData();
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

  public setAnswerLabel() {
    let set_label = true;

    for(let i = 0; i < this.labelsToShow.length; i ++ ) {
      if(this.labelsToShow[i] == "answer") {
        this.labelsToShow.splice(i, 1);
        set_label = false;
      }
    }
    if(set_label) {
      this.labelsToShow.push("answer");
    }

    this.render(this.node.id, this.children, this.labelsToShow);
  }

  public setQuestionlabelLabel() {
    let set_label = true;

    for(let i = 0; i < this.labelsToShow.length; i ++ ) {
      if(this.labelsToShow[i] == "question_label") {
        this.labelsToShow.splice(i, 1);
        set_label = false;
      }
    }
    if(set_label) {
      this.labelsToShow.push("question_label");
    }
  }

  public setQuestionLabel() {
    let set_label = true;

    for(let i = 0; i < this.labelsToShow.length; i ++ ) {
      if(this.labelsToShow[i] == "question") {
        this.labelsToShow.splice(i, 1);
        set_label = false;
      }
    }
    if(set_label) {
      this.labelsToShow.push("question");
    }
  }

  public setTreeData() {
    
    let d = [];
    if(this.node.id != undefined) {
      this.treeService.getChildren(this.node.id).toPromise().then( data => {
        console.log(data)
        this.children = JSON.parse(data);
        this.render(this.node.id, JSON.parse(data), "question");
      });
    }
  }

  public fillAnswersToShow(data) {
    this.answerstoShow = [];
    for(let i = 0; i < this.children.length; i ++ ) {
      for(let j = 0; j < data.length; j ++ ) {
        if(String(this.children[i].nodeId) == data[j]) {
          this.answerstoShow.push(this.children[i].answer);
        }
      }
    }
  }

  //TREE PART ************************************************************************************************

  public render(root, children, label) {

    // prepare data
    var tree_data = [ 
      { // node root
        data: { id: this.node.id, question: this.node.question }
      }
    ]; 

    console.log(children.size);
    for(var i = 0; i < children.length; i ++ ) {
      var obj = {
        data: { id: children[i].nodeId, question: children[i].question, answer: children[i].answer },
        position: {
          y: 200
        }
      } 
      tree_data.push(obj);
    }
    //////////////////

    console.log(tree_data);

    var self = this;
    // Initialization of the tree instance
    let cy_contianer = this.renderer.selectRootElement("#cy_information");
    let cy = cytoscape({
    
    container: cy_contianer,
    elements: tree_data,
    style: [
      {
          selector: 'node',
          style: {
              'background-color': '#4db8ff',
              'border-width': 4,
              'border-color': '#006bb3',
              'width': 60,
              'height': 60,
              'font-size': 20
          }
      }]
    });

    for(var i = 0; i < children.length; i ++ ) {
      var obj_edge = {
        data: { id: this.node.id + "-" + children[i].nodeId, source: this.node.id, target: children[i].nodeId }
      } 

      cy.add(obj_edge);
    }

    var options = {
      name: 'breadthfirst',
      
      fit: false, // whether to fit the viewport to the graph
      directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
      padding: 30, // padding on fit
      circle: false, // put depths in concentric circles if true, put depths top down if false
      spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
      roots: "#" + root, // the roots of the trees
      maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
      animate: false, // whether to transition the node positions
      animationDuration: 1000, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled,
      animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
      ready: undefined, // callback on layoutready
      stop: undefined, // callback on layoutstop
      transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
      };
    
      cy.layout( options ).run();
      cy.userZoomingEnabled( false );
      cy.zoom(0.8);
      cy.center();
      cy.pan({x: 50, y: 5 });
    
      for(var i = 0; i < cy.nodes().size(); i ++ ) {
        if(cy.nodes()[i].data().id != root ) {
          console.log(cy.nodes()[i].data().id)
            cy.$('#' + cy.nodes()[i].id()).position('y', 200);
        }
    }

    // click on the edge
    cy.on('tap', 'edge', function(evt) {
      var edge = evt.target;
      console.log( 'tapped ' + edge.id() );
    });
    
    // click on the node
    cy.on('tap', 'node', function(evt) {
    
        var node = evt.target;    
    
        // change background color when clicked
        if(cy.$("#" + node.id()).style('background-color') == '#b3e0ff') {

          for(var i = 0; i < self.selectedNodes.length; i ++ ) {
            if(self.selectedNodes[i] == node.id()) {
                self.selectedNodes.splice(i, 1);
                self.fillAnswersToShow(self.selectedNodes);
            }
          }

          cy.$("#" + node.id()).style({
            'background-color': '#4db8ff',
            'width': 60,
            'height': 60
          })  
        } else {
          cy.nodes("#" + node.id()).select();
          self.selectedNodes.push(node.id());
          self.fillAnswersToShow(self.selectedNodes);

          cy.$("#" + node.id()).style({
            'background-color': '#b3e0ff',
            'width': 60,
            'height': 60
          })  
        }
        self.clickedNode(node.id());
    });
    
    // click outside of the tree
    cy.on('tap', function(event) {
      // target holds a reference to the originator
      // of the event (core or element)
      
      var evtTarget = event.target;
      // return to the normal state of the node
      if( evtTarget === cy ) {
          cy.$("node").style({
                    'background-color': '#4db8ff',
                    'width': 60,
                    'height': 60
                  });
          self.selectedNodes = [];
          self.answerstoShow = [];
          self.showTextEditor = false;
          self.showQuestionClickedMessage = false;
      } else {
  
      }
    });

    // right click
    cy.on('cxttap', 'node', function(event) {
    
    // move to the function
    cy.$("node").style({
        'background-color': '#4db8ff',
        'width': 60,
        'height': 60
    })

    
    var node = event.target;
    
    if( node === cy ) {
    
    cy.$("node").style({
        'background-color': '#4db8ff',
        'width': 60,
        'height': 60
    })
    
  }
    
    var pos = cy.$("#" + node.id()).renderedPosition();
    
    cy.$("#" + node.id()).style({
        'background-color': '#b3e0ff',
        'width': 80,
        'height': 80
    })
    
    });

    var edges = cy.edges();
    var nodes = cy.nodes();

    for(var i = 0; i < edges.length; i ++ ) {
      console.log(edges[i].target()[0].data().answer);
      edges[i].data("answer", edges[i].target()[0].data().answer);
      edges[i].target()[0].style("label", edges[i].data().answer);
      edges[i].style("font-size", "30");
    }
    

    for(var i = 0; i < nodes.length; i ++ ) {
      if(nodes[i].data().id == root) {
        var local_label = nodes[i].data().question;
        nodes[i].style("label", local_label);
      }
    }
  }
}

