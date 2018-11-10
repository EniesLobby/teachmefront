import { Component, OnChanges, Renderer, ElementRef, Input, Output, EventEmitter, Inject, OnInit, Injectable, SimpleChanges } from '@angular/core';
import * as cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import { TreeService } from './tree.service';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})

@Injectable()
export class TreeComponent implements OnChanges {

  @Input() public data: any;
  @Input() public appr: any;
  @Input() public options: any;
  @Input() public tree_data: any;

  @Input() public elements: any;
  @Input() public style: any;
  @Input() public layout: any;
  @Input() public zoom: any;
  @Input() public label_to_show = "id";

  current_rootId: any = 8;

  @Input() refreshTree;

  public local_data: any;
  public node_visibility: boolean = false;

  @Output() rightClickedCoordinates = new EventEmitter();
  @Output() showContextMenu = new EventEmitter();
  @Output() leftClickedCoordinates = new EventEmitter();
  @Output() showRadialMenu = new EventEmitter();
  @Output() current_node = new EventEmitter();
  @Output() clicked_node_children = new EventEmitter();

  node_for_right_menu;

  message: any;
  subscription: Subscription;

  public constructor(private renderer : Renderer, private el: ElementRef, private treeService: TreeService) {

    this.subscription = this.treeService.getMessage().subscribe(message => {
      if(message != undefined) {
          if(message.text == 'refresh') {
            this.ngOnInit();
          }  
    
          if(message.text == 'toggle') {
            this.refresh("", message.data)
          }
    
          if(message.text == 'label') {
            this.label_to_show = message.data;
            this.refresh(message.data, "")
          }

          if(message.text == 'rootId') {
            console.log("message.data", message.data);
            this.current_rootId = message.data;
            this.ngOnInit();
          }
      }
    });


    this.appr = this.appr || [
      {
          selector: 'node',
          style: {
              'background-color': '#4db8ff',
              'border-width': 4,
              'border-color': '#006bb3',
              'width': 90,
              'height': 90,
              'font-size': 50
          }
      }]

    
    this.options = this.options || {
      name: 'breadthfirst',
      
      fit: false, // whether to fit the viewport to the graph
      directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
      padding: 30, // padding on fit
      circle: false, // put depths in concentric circles if true, put depths top down if false
      spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
      roots: "#" + this.current_rootId, // the roots of the trees
      maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
      animate: false, // whether to transition the node positions
      animationDuration: 1000, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled,
      animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
      ready: undefined, // callback on layoutready
      stop: undefined, // callback on layoutstop
      transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
      };
  }

  public ngOnChanges(changes: SimpleChanges): any { }

  refresh(label, toggle) {
    this.render(  
        this.rightClickedCoordinates, 
        this.showContextMenu, 
        this.leftClickedCoordinates, 
        this.showRadialMenu, 
        this.current_node,
        this.clicked_node_children,
        label,
        toggle
        );
  }

  public ngOnInit() {
      this.getTree().then(() =>
      this.render(
          this.rightClickedCoordinates, 
          this.showContextMenu, 
          this.leftClickedCoordinates, 
          this.showRadialMenu, 
          this.current_node,
          this.clicked_node_children,
          this.label_to_show,
          ""
        )); // Now has value;

      $("body").on("contextmenu", function(e) {
        return false;
      });
  }

  public getTree() {
    return this.treeService.getTree(this.current_rootId).toPromise().then( data => {
      var temp = data;
      temp = temp.replace("\\", "");
      temp = temp.replace(/(\r\n\t|\n|\r\t)/gm,"");
      this.tree_data = JSON.parse(temp);
    });

  }

  public setNode(node) {
    console.log("node", node);
    this.node_for_right_menu = node;
  }

  // RENDER FUNCTION ************************************************************************************
  public render(rightClickedCoordinates, 
                showContextMenu, 
                leftClickedCoordinates, 
                showRadialMenu, 
                current_node, 
                clicked_node_children,
                label,
                toggle) {
    
    var self = this;
    // Initialization of the tree instance
    let cy_contianer = this.renderer.selectRootElement("#cy");
    let cy = cytoscape({

      container: cy_contianer,
      elements: this.tree_data,
      style: this.appr
    });

    cy.layout( this.options ).run();
    cy.userZoomingEnabled( false );
    cy.fit();
    cy.zoom(0.55);
    cy.center();
    cy.pan({
      x: 140,
      y: 60 
    });
    
    // Toggle given node if called
    if(toggle != undefined) {
      
      var nodeId = toggle.id;
      self.node_visibility = !self.node_visibility;

      if(self.node_visibility) {
        cy.nodes("#" + nodeId).successors().style("visibility", "visible");
      } else {
        cy.nodes("#" + nodeId).successors().style("visibility", "hidden");
      }

    }

    // click on the edge
    cy.on('tap', 'edge', function(evt) {
      showContextMenu.emit(false)
      var edge = evt.target;
      console.log( 'tapped ' + edge.id() );
    });

    // mouseover node
    cy.on('mouseover', 'node', function(evt) {
      var node = evt.target;
      
      // change background color when hover
      cy.$("#" + node.id()).style({
        'border-width': 4,
        'border-color': '#99C3E0',
      })  
    })

    // hover node
    cy.on('mouseout', 'node', function(evt) {
      var node = evt.target;
      
      // change background color when hover
      cy.$("#" + node.id()).style({
        'border-width': 4,
        'border-color': '#006bb3',
      })  
    })

    // click on the node
    cy.on('tap', 'node', function(evt) {

      cy.$("node").style({
        'background-color': '#4db8ff',
        'width': 90,
        'height': 90,
        'border-width': 4
      })

      cy.nodes('[question=""]').style({
        'background-color': '#f1f1f1'
      });
      
      // hide context menu on click
      showContextMenu.emit(false);
      showRadialMenu.emit(false);

      var node = evt.target;
      
      // change background color when clicked
      cy.$("#" + node.id()).style({
                            'background-color': '#b3e0ff',
                            'width': 110,
                            'height': 110
                          })  
      // onclick view nodes params
      var pos = cy.$("#" + node.id()).renderedPosition();
      
      leftClickedCoordinates.emit(pos);
      self.setNode(node.data());
      $("#node_information").empty();

      var edgesFromJerry = cy.edges('edge[source="' + node.id() + '"]');
      var jerryChildren = edgesFromJerry.targets();
      jerryChildren.css('border-width', '8');
      
    });

    //Process label array
  
    var nodes = cy.nodes();
    var edges = cy.edges();

    var label_question = 0;
    var label_answer = 0;
    var label_LabelQuestion = 0;
    var label_ids = 0;
    
    if(typeof label == 'object') {

      for(var index = 0; index < label.length; index ++ ) {
        if(label[index] == 'Answers') {
          label_answer = 1;
        }

        if(label[index] == 'Questions') {
          label_question = 1;
        }

        if(label[index] == 'Ids') {
          label_ids = 1;
        }

        if(label[index] == 'Question Labels') {
          label_LabelQuestion = 1;
        }
      }
    }

    for(var i = 0; i < edges.size(); i ++ ) {
      edges[i].data("answer", edges[i].target()[0].data().answer);
      edges[i].style("label", edges[i].data().answer);
      edges[i].style("font-size", "50");
    }
    
    for(var i = 0; i < nodes.size(); i ++ ) {
      var local_label = nodes[i].data().question;
      local_label = local_label + " #" + nodes[i].data().id;
      nodes[i].style("label", local_label);
    }
    

    // click outside of the tree
    cy.on('tap', function(event) {

        // target holds a reference to the originator
        // of the event (core or element)
    
        var evtTarget = event.target;
    
        // return to the normal state of the node
        if( evtTarget === cy ) {
            cy.$("node").style({
                      'background-color': '#4db8ff',
                      'width': 90,
                      'height': 90,
                      'border-width': 4
                    });
            
            cy.nodes('[question=""]').style({
              'background-color': '#f1f1f1'
            });

            showContextMenu.emit(false);
            showRadialMenu.emit(false);
        } else {
          console.log(evtTarget);
        }
      });

    cy.nodes('[question=""]').style({
      'background-color': '#f1f1f1'
    })

    // right click
    cy.on('cxttap', 'node', function(event) {

      // move to the function
      cy.$("node").style({
        'background-color': '#4db8ff',
        'width': 90,
        'height': 90
      })

      cy.nodes('[question=""]').style({
        'background-color': '#f1f1f1'
      })

      var node = event.target;
      current_node.emit(node.data());

      if( node === cy ) {
        
        cy.$("node").style({
          'background-color': '#4db8ff',
          'width': 90,
          'height': 90,
          'border-width': 4
        })

        showContextMenu.emit(false);
        showRadialMenu.emit(false);
        return
      }

      var pos = cy.$("#" + node.id()).renderedPosition();

      cy.$("#" + node.id()).style({
        'background-color': '#b3e0ff',
        'width': 110,
        'height': 110
      })

      var edgesFromJerry = cy.edges('edge[source="' + node.id() + '"]');
      var jerryChildren = edgesFromJerry.targets();
      
      //jerryChildren.css('background-color', 'blue');

      var children = [];

      for (var i = 0; i < jerryChildren.length; i ++) { 
        children.push(jerryChildren[i].data())
      }
      
      clicked_node_children.emit(children);   
      rightClickedCoordinates.emit(pos);

    });
  }
}
