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
  @Input() refreshTree;

  current_rootId: any = 423;
  selected_edges = [];

  public local_data: any;
  public node_visibility: boolean = false;

  location = [];

  @Output() rightClickedCoordinates = new EventEmitter();
  @Output() showContextMenu = new EventEmitter();
  @Output() showRadialMenu = new EventEmitter();
  clicked_node_children: any;
  leftClickedCoordinates: any;
  current_node: any;
  node_for_right_menu;
  message: any;
  subscription: Subscription;

  public constructor(private renderer : Renderer, private el: ElementRef, private treeService: TreeService) {

    this.subscription = this.treeService.getMessage().subscribe(message => {
      if(message != undefined) {
          if(message.text == 'refresh') {
            this.ngOnInit();
          }  
    
          if(message.text == 'toggle_on') {
            this.refresh("", "on", message.data);
          }
          
          if(message.text == 'toggle_off') {
            this.refresh("", "off", message.data);
          }
          
          if(message.text == 'label') {
            this.label_to_show = message.data;
            this.refresh(message.data, "", "");
          }

          if(message.text == 'rootId') {
            console.log("message.data", message.data);
            this.current_rootId = message.data;
            console.log("this.currentId", this.current_rootId);
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

  refresh(label, status, toggle) {
    this.render(  
        this.rightClickedCoordinates, 
        this.showContextMenu, 
        this.leftClickedCoordinates, 
        this.showRadialMenu, 
        this.current_node,
        this.clicked_node_children,
        label,
        status,
        toggle,
        this.current_rootId
        );
  }

  public ngOnInit() {
      if(this.current_rootId != undefined) {
        this.getTree().then(() =>
        this.render(
            this.rightClickedCoordinates, 
            this.showContextMenu, 
            this.leftClickedCoordinates, 
            this.showRadialMenu, 
            this.current_node,
            this.clicked_node_children,
            this.label_to_show,
            "",
            "",
            this.current_rootId
          )); // Now has value;
      }

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
                status,
                toggle,
                rootId) {
    
    var self = this;
    // Initialization of the tree instance
    let cy_contianer = this.renderer.selectRootElement("#cy");
    let cy = cytoscape({

      container: cy_contianer,
      elements: this.tree_data,
      style: this.appr
    });

    cy.edges().style({
      'width': 7
    });

    cy.layout( this.options ).run();
    cy.userZoomingEnabled( false );
    cy.fit();
    cy.zoom(0.65);
    cy.center();
    cy.pan({
      x: 300,
      y: 60 
    });

    // set root

    if(rootId != undefined ) {
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
        roots: "#" + rootId, // the roots of the trees
        maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
        animate: false, // whether to transition the node positions
        animationDuration: 1000, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled,
        animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop
        transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
        };

      cy.layout(options).run();
    }
    
    // Toggle given node if called
    if(toggle != undefined) {
      
      var nodeId = toggle.id;
      console.log("toggle.id", toggle.id);
      self.node_visibility = !self.node_visibility;

      if(status == "off") {
        cy.nodes("#" + nodeId).successors().style("visibility", "hidden");
      } 
      
      if(status == "on") {
        cy.nodes("#" + nodeId).successors().style("visibility", "visible");
      }
    }

    if(self.location.length != 0) {
      for(var i = 0; i < cy.nodes().length; i ++ ) {
        for(var j = 0; j < self.location.length; j ++ ) {
          if(cy.nodes()[i].data().id == self.location[j].nodeId) {
            cy.nodes()[i].position({x: self.location[j].x, y: self.location[j].y});
          }
        }
      }
    }

    // fill positions
    for(var i = 0; i < cy.nodes().length; i ++ ) {
      self.location.push({
        nodeId: cy.nodes()[i].data().nodeId,
        x: cy.nodes()[i].position().x,
        y: cy.nodes()[i].position().y,
      })
    }

    // end of drag
    cy.on('position', 'node', function(evt) {
      var node = evt.target;
      for(var i = 0; i < cy.nodes().length; i ++ ) {
        self.location.push({
          nodeId: cy.nodes()[i].data().id,
          x: cy.nodes()[i].position().x,
          y: cy.nodes()[i].position().y,
        })
      }
    });


    // click on the edge [***INFORMATION MECHANISM*********]
    cy.on('tap', 'edge', function(evt) {

      showContextMenu.emit(false);
      var edge = evt.target;   
      
      // Check if edges is in the array
      for(var i = 0; i < self.selected_edges.length; i ++ ) {
        if(self.selected_edges[i] == edge.target().id()) {
          self.selected_edges.splice(i, 1);
        }
      }
    
      edge.style({
        'width': 14,
        'line-color': '#0760ef'
      });

      self.selected_edges.push(edge.target().id());

      var container = {
        nodeId: edge.source().id(),
        selected_edges: self.selected_edges,
      }

      self.treeService.sendMessage("button_position", {
        x: (edge.source().renderedPosition().x + edge.target().renderedPosition().x) / 2,
        y: (edge.source().renderedPosition().y + edge.target().renderedPosition().y) / 2,
      })
      self.treeService.sendMessage("view_add_information_button", container);
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

    //send root Id to show info
    for(var i = 0; i < cy.nodes().length; i ++ ) {
      if(cy.nodes()[i].data().id == cy.nodes()[i].data().rootId) {
        this.treeService.sendMessage("root_position", cy.nodes()[i].renderedPosition());
      }
    }

    // hover node
    cy.on('mouseout', 'node', function(evt) {
      var node = evt.target;   
      // change background color when hover
      cy.$("#" + node.id()).style({
        'border-width': 4,
        'border-color': '#006bb3',
      })
      
      cy.nodes('[question=""]').style({
        'border-color': 'white',
        'background-color': 'white',
        "background-image": [ "https://cdn1.iconfinder.com/data/icons/essentials-pack/96/add_create_new_plus_positive-512.png" ],
        "background-fit": "cover cover",
        "background-image-opacity": 0.5
      });
    })

    // hover edge
    cy.on('mouseout', 'edge', function(evt) {
      var edge = evt.target;
    })

    // set i sign on informated edge
    for(var i = 0; i < cy.nodes().length; i ++ ) {
      if(cy.nodes()[i].data().information == "true") {
        
      }
    }

    // click on the node
    cy.on('tap', 'node', function(evt) {   
      cy.$("node").style({
        'background-color': '#4db8ff',
        'width': 90,
        'height': 90,
        'border-width': 4
      })

      cy.nodes('[question=""]').style({
        'border-color': 'white',
        'background-color': 'white',
        "background-image": [ "https://cdn1.iconfinder.com/data/icons/essentials-pack/96/add_create_new_plus_positive-512.png" ],
        "background-fit": "cover cover",
        "background-image-opacity": 0.5
      });
      
      // hide context menu on click
      showContextMenu.emit(false);
      showRadialMenu.emit(false);
      var node = evt.target;
      self.current_node = node.data();
   
      var pos = cy.$("#" + node.id()).renderedPosition();
      var edgesFromJerry = cy.edges('edge[source="' + node.id() + '"]');
      var jerryChildren = edgesFromJerry.targets();
      
      var children = [];
      for (var i = 0; i < jerryChildren.length; i ++) { 
        children.push(jerryChildren[i].data())
      }
      
      self.clicked_node_children = children;   
      rightClickedCoordinates.emit(pos);
      
      // change background color when clicked
      cy.$("#" + node.id()).style({
                            'background-color': '#b3e0ff',
                            'width': 110,
                            'height': 110
                          })  
      // onclick view nodes params
      var pos = cy.$("#" + node.id()).renderedPosition();
      
      console.log("node.data()", node.data());

      if(cy.$("#" + node.id()).data("question") == "") {
        self.treeService.sendMessage("open_editor", node.data());
        self.treeService.sendMessage("radial_menu_toggle_off", "");
      }

      self.leftClickedCoordinates = pos;
      self.setNode(node.data());
      $("#node_information").empty();

      var edgesFromJerry = cy.edges('edge[source="' + node.id() + '"]');
      var jerryChildren = edgesFromJerry.targets();
      jerryChildren.css('border-width', '8');
      
    });

    //Process label array
    var nodes = cy.nodes();
    var edges = cy.edges();
  
    for(var i = 0; i < edges.size(); i ++ ) {
      edges[i].data("answer", edges[i].target()[0].data().answer);
      edges[i].style("label", edges[i].data().answer);
      edges[i].style("font-size", "50");
    }
    
    for(var i = 0; i < nodes.size(); i ++ ) {
      var local_label = nodes[i].data().question;
      //local_label = local_label + " #" + nodes[i].data().id;
      nodes[i].style("label", local_label);
    }

    // click outside of the tree
    cy.on('tap', function(event) {
      
      self.treeService.sendMessage("radial_menu_toggle_off", "");

        // target holds a reference to the originator
        // of the event (core or element)
    
        var evtTarget = event.target;
    
        // return to the normal state of the node
        if( evtTarget === cy ) {
          self.selected_edges = [];

          cy.$("node").style({
                    'background-color': '#4db8ff',
                    'width': 90,
                    'height': 90,
                    'border-width': 4
                  });
  
          cy.$("edge").style({
              'width': 7,
              'line-color': 'gray'
          })
  
          cy.nodes('[question=""]').style({
            'border-color': 'white',
            'background-color': 'white',
            "background-image": [ "https://cdn1.iconfinder.com/data/icons/essentials-pack/96/add_create_new_plus_positive-512.png" ],
            "background-fit": "cover cover",
            "background-image-opacity": 0.5
          });
  
          showContextMenu.emit(false);
          showRadialMenu.emit(false);
          self.treeService.sendMessage("hide_add_information_button", "");
        } else {
          console.log(evtTarget);
        }
      });

      cy.nodes('[question=""]').style({
        'border-color': 'white',
        'background-color': 'white',
        "background-image": [ "https://cdn1.iconfinder.com/data/icons/essentials-pack/96/add_create_new_plus_positive-512.png" ],
        "background-fit": "cover cover",
        "background-image-opacity": 0.5
      });

    // right click
    cy.on('cxttap', 'node', function(event) {

      // move to the function
      cy.$("node").style({
        'background-color': '#4db8ff',
        'width': 90,
        'height': 90
      })

      cy.nodes('[question=""]').style({
        'border-color': 'white',
        'background-color': 'white',
        "background-image": [ "https://cdn1.iconfinder.com/data/icons/essentials-pack/96/add_create_new_plus_positive-512.png" ],
        "background-fit": "cover cover",
        "background-image-opacity": 0.5
      });

      var node = event.target;

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
      var children = [];

      for (var i = 0; i < jerryChildren.length; i ++) { 
        children.push(jerryChildren[i].data())
      }
    });
  }
}
