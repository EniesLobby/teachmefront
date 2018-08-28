import { Component, OnChanges, Renderer, ElementRef, Input, Output, EventEmitter, Inject } from '@angular/core';
import * as cytoscape from 'cytoscape';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {  
  
  title = 'app';



  public ngOnInit2() {

    var data = [
      // nodes
      { "data": { "id": '1', question: "ae", answer: "ae", information: "ae" } },
      { "data": { "id": '2', question: "ae", answer: "ae", information: "ae" } },
      { "data": { "id": '3', question: "ae", answer: "ae", information: "ae" } },
      
      // edges
      { data: { id: '1-2', source: '1', target: '2' } },
      { data: { id: '1-3', source: '1', target: '3' } } ]
  
    var appr =  [
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

    var options = {
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

      var cy = cytoscape({
        container: document.getElementById('cy'),
        elements: data,
        style: appr
      });
        
    cy.layout( options ).run();
      

    }

}
