import { TreeService } from '../tree/tree.service';
import { UserService } from '../UserService.service';
import { TreeManagerComponent } from '../tree-manager/tree-manager.component';
import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { QuillEditorComponent } from 'ngx-quill';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import Quill from 'quill';
import { Subscription } from 'rxjs'; 
import * as $ from 'jquery';
import { TutorialComponent } from '../tutorial/tutorial.component'
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  x = 10;
  y = 10;
  
  showProfileIcon = true;
  showTrees: boolean = false;
  user: any;
  rootId_title = [];
  titleEditForm: FormGroup;
  subscription: Subscription;

  constructor(config: NgbModalConfig, private modalService: NgbModal, 
    private router: Router,
    private treeService: TreeService, private formBuilder: FormBuilder, private userService: UserService ) { 
    
    this.subscription = this.treeService.getMessage().subscribe(message => {
      if(message != undefined) {
        if(message.text == 'update_tree_list') {
          this.ngOnInit();
        }
      }
    });

    this.createForm();
  }

  ngOnInit() {

    this.getUser();
    this.titleEditForm = this.formBuilder.group(
      {
        aliases: this.formBuilder.array([])
      });
  }

  LogOut() {
    this.router.navigateByUrl('/');
  }

  openTutorial() {

    const modalRef = this.modalService.open(TutorialComponent, { windowClass : "tutorial-modal" });
  }

  public selectTree(rootId: any) {
    this.treeService.sendMessage("rootId", rootId);
  }

  private createForm() {
    this.titleEditForm = this.formBuilder.group(
      {
        aliases: this.formBuilder.array([])
      });

  }

  public createTree() {

    this.treeService.createTree().toPromise().then(
      val => {
        
          this.treeService.addRoot(this.user.email, val.toString()).subscribe(
            val => {
              this.rootId_title = [];
              this.treeService.sendMessage("update_tree_list", null);
            },
            response => {
              console.log(response);
            }
          )
          
          console.log("POST call successful value returned in body", val);

          this.treeService.sendMessage("rootId", val);
          this.treeService.sendMessage("showRootHelper", val);
          // this.ngOnInit();
      },

      response => {
          console.log("POST call in error", response);
      });
  }

  public deleteTree(rootId) {
    // reanswer
    console.log("rootId delete", rootId)
  }

  openTreeManager(rootId) {

    const modalRef = this.modalService.open(TreeManagerComponent);
    modalRef.componentInstance.rootId = rootId;
  }

  get aliases() {
    
    return this.titleEditForm.get('aliases') as FormArray;
  }

  public openNav() {

    this.treeService.sendMessage("showHelperProfile", false);
    document.getElementById("mySidenav").style.width = "600px";
    this.showProfileIcon = false;
  }
  
  public closeNav() {

    document.getElementById("mySidenav").style.width = "0";
    this.showProfileIcon = true;
  }
  
  public deleteAllNodes() {
    
    this.treeService.deleteAllNodes();
    this.treeService.sendMessage("refresh", null);
  }

  public async getUser() {
    
    await this.treeService.getUser(this.userService.getEmail()).toPromise().then(
      val => {
        this.user = JSON.parse(val);
        console.log(this.user);
        
        if(this.user.firstEnter) {
          this.openTutorial();
        }

        this.getInformation();
      }
    )
  }

  public async getInformation() {
    
    this.rootId_title = [];
    let current_rootId;

    for(var i = 0; i < this.user.treeRootIds.length; i ++ ) {
      
      current_rootId = this.user.treeRootIds[i];
      
      await this.treeService.getInformationOne(this.user.treeRootIds[i]).toPromise().then(
        val => {
          var data = <any> val;
          if(data == null) {
            this.rootId_title.push({
              rootId:  current_rootId,
              title: "Unnamed tree"
            })

            this.aliases.push(this.formBuilder.control("Unnamed tree"));
            this.showTrees = true;
          
          } else {
            this.rootId_title.push({
              rootId:  current_rootId,
              title: data.note.replace(/<[^>]*>/g, '')
            })
          
            this.aliases.push(this.formBuilder.control(data));
            this.showTrees = true;
          }
        }
      )
    }

    this.selectTree(this.user.treeRootIds[0]);

  }

}
