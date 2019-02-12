import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TreeService } from '../tree/tree.service';
import { QuillEditorComponent } from 'ngx-quill';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import Quill from 'quill';
import { Subscription } from 'rxjs'; 
import { UserService } from '../UserService.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {

  tutorials = [
    {
      text: '<h3 style="align-content: center;">Welcome to TEACHME!</h3><h4>Click on Profile Icon, create a tree, fill it with questions and answers!</h5>',
      title: 'First steps: Creating a tree',
      gifLink: '/assets/gif/create_tree.gif'
    },
    {
      text: '<h4>To equip your students with advice, simply assign information to the respective answer.</h4>',
      title: 'First steps: Assign information (advice)',
      gifLink: '/assets/gif/information.gif'
    },
    {
      text: '<h4>Stay aware of result</h4>',
      title: 'First steps: Check result',
      gifLink: '/assets/gif/demo.gif'
    }
  ];

  currentTutorial = 0;
  email: String;

  constructor( private userService: UserService, config: NgbModalConfig, public activeModal: NgbActiveModal, private treeService: TreeService ) {
  
  }

  ngOnInit() {
    
    this.email = this.userService.getEmail()
  }

  next() {

    this.currentTutorial = this.currentTutorial + 1;
    if(this.currentTutorial == this.tutorials.length) {
      this.activeModal.close();
      this.setViewed();
    }
  }
  
  prev() {
    
    this.currentTutorial = this.currentTutorial - 1;
  }

  setViewed() {
    
    this.treeService.setViewed(this.email).toPromise().then(res => {

    })
  }
}
