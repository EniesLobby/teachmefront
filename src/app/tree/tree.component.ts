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

  public constructor(private renderer : Renderer, private el: ElementRef, private treeService: TreeService) {
    
    this.data = this.data || [
      { // node a
        data: { id: 'a' }
      },
      { // node b
        data: { id: 'b' }
      },
      { // edge ab
        data: { id: 'ab', source: 'a', target: 'b' }
      }]

    this.tree_data = this.tree_data;

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
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled,
      animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
      ready: undefined, // callback on layoutready
      stop: undefined, // callback on layoutstop
      transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
      };
  }

  refresh() {
    console.log("ae");
    this.render();
    this.tests();
  }
  
  public ngOnChanges(): any {

    this.getTree();
    this.render();
  }

  public ngOnInit() {

    this.getTree();
    this.render();
  }

  public tests() {

    
  }

  public getTree() {

    this.treeService.getTree()
    .subscribe( data => {
      this.tree_data = data
    });
  }

  public render() {
    
    let cy_contianer = this.renderer.selectRootElement("#cy");

    let cy = cytoscape({
      container: cy_contianer,
      elements: this.tree_data,
      style: this.appr
    });

    cy.layout( this.options ).run();


    cy.on('tap', 'edge', function(evt) {
      var edge = evt.target;
      console.log( 'tapped ' + edge.id() );
    });

    cy.on('tap', 'node', function(evt) {
        
      var node = evt.target;
      
      cy.$("#" + node.id()).style({'background-color': '#b3e0ff'})
      
      // onclick view nodes params
      var pos = cy.$("#" + node.id()).position();
      $("#node_information").empty();        

    });

    
    cy.on('tap', function(event) {
        // target holds a reference to the originator
        // of the event (core or element)
    
        var evtTarget = event.target;
      
        if( evtTarget === cy ) {
            cy.$("node").style({'background-color': '#4db8ff'})
        } else {
          console.log('tap on some element');
        }
      });
  }


}
