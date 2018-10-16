import { Component, OnChanges, Renderer, ElementRef, Input, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';

import { TreeService } from './tree.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})

export class TreeComponent implements OnChanges {

  @Input() public data: any;
  @Input() public appr: any;
  @Input() public options: any;
  @Input() public tree_data: any;

  @Input() public elements: any;
  @Input() public style: any;
  @Input() public layout: any;
  @Input() public zoom: any;


  public local_data: any;

  @Output() rightClickedCoordinates = new EventEmitter();
  @Output() showContextMenu = new EventEmitter();

  @Output() leftClickedCoordinates = new EventEmitter();
  @Output() showRadialMenu = new EventEmitter();

  public constructor(private renderer : Renderer, private el: ElementRef, private treeService: TreeService) {

    this.zoom = this.zoom || {
      min: 0.1,
      max: 1.5
    };

    this.appr = this.appr || [
      {
          selector: 'node',
          style: {
              'background-color': '#4db8ff',
              'border-width': 4,
              'border-color': '#006bb3',
              'width': 90,
              'height': 90,
              label: 'data(id)',
              'font-size': 50
          }
      }]

    
    this.options = this.options || {
      name: 'breadthfirst',
      
      fit: true, // whether to fit the viewport to the graph
      directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
      padding: 30, // padding on fit
      circle: false, // put depths in concentric circles if true, put depths top down if false
      spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
      roots: "#48", // the roots of the trees
      maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
      animate: true, // whether to transition the node positions
      animationDuration: 1000, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled,
      animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
      ready: undefined, // callback on layoutready
      stop: undefined, // callback on layoutstop
      transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
      };
  }

  public ngOnChanges(): any {
    this.render(this.rightClickedCoordinates, this.showContextMenu, this.leftClickedCoordinates, this.showRadialMenu);
    console.log(this.el.nativeElement);
  }

  refresh() {
    this.render(this.rightClickedCoordinates, this.showContextMenu, this.leftClickedCoordinates, this.showRadialMenu);
  }

  public ngOnInit() {

      this.getTree().then(() =>
      this.render(this.rightClickedCoordinates, this.showContextMenu, this.leftClickedCoordinates, this.showRadialMenu)); // Now has value;

      $("body").on("contextmenu", function(e) {
        return false;
      });
  }

  public getTree() {
    return this.treeService.getTree().toPromise().then( data => {
      this.tree_data = data
      console.log(data);
    });

  }

  public render(rightClickedCoordinates, showContextMenu, leftClickedCoordinates, showRadialMenu) {
    
    // Initialization of the tree instance
    let cy_contianer = this.renderer.selectRootElement("#cy");
    let cy = cytoscape({

      container: cy_contianer,
      elements: this.tree_data,
      style: this.appr,
      zoom: this.zoom,
      pan: {x: 1, y: 20}
    });

    cy.layout( this.options ).run();
    cy.userZoomingEnabled( false );

    // click on the edge
    cy.on('tap', 'edge', function(evt) {
      showContextMenu.emit(false)
      var edge = evt.target;
      console.log( 'tapped ' + edge.id() );
    });

    // click on the node
    cy.on('tap', 'node', function(evt) {
      
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
      $("#node_information").empty();        
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
                      'width': 90,
                      'height': 90
                    })

            showContextMenu.emit(false);
            showRadialMenu.emit(false);
        } else {
          console.log(evtTarget);
        }
      });

    // right click
    cy.on('cxttap', 'node', function(event) {

      // move to the function
      cy.$("node").style({
        'background-color': '#4db8ff',
        'width': 90,
        'height': 90
      })

      var node = event.target;

      if( node === cy ) {
        
        cy.$("node").style({
          'background-color': '#4db8ff',
          'width': 90,
          'height': 90
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
      
      rightClickedCoordinates.emit(pos);
    });
  }
}
