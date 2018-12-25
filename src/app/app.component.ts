import { Component, OnChanges, Renderer, ElementRef, 
          Input, Output, EventEmitter, Inject, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {  
  
  title = 'TEACHME';

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
  }
}
