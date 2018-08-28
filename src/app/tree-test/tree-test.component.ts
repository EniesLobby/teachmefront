import { Component, OnChanges, Renderer, ElementRef, Input, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import * as $ from 'jquery';

@Component({
  selector: 'app-tree-test',
  templateUrl: './tree-test.component.html',
  styleUrls: ['./tree-test.component.css']
})

export class TreeTestComponent implements OnInit {

  public constructor(private renderer : Renderer, private el: ElementRef) { 
  
  }
  
  public ngOnInit(): any {
    this.render();
  }

  public render() {
    
    let cy_contianer = this.renderer.selectRootElement("#cy");
    console.log("ae");

    let cy = cytoscape({
  
      container: cy_contianer, // container to render in
    
      elements: [ // list of graph elements to start with
        { // node a
          data: { id: 'a' }
        },
        { // node b
          data: { id: 'b' }
        },
        { // edge ab
          data: { id: 'ab', source: 'a', target: 'b' }
        }
      ],
    
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },
    
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
    
      layout: {
        name: 'grid',
        rows: 1
      }
    
    });
    
  }


}
