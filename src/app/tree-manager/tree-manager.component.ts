import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreeService } from '../tree/tree.service';
import { UserService } from '../UserService.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-tree-manager',
  templateUrl: './tree-manager.component.html',
  styleUrls: ['./tree-manager.component.css']
})
export class TreeManagerComponent implements OnInit {

  @Input() rootId: any;
  title: any;
  information: any;
  subscription: Subscription;
  treeEditForm: FormGroup;

  public editorOptions = {
    toolbar: [
    ]
  };
 
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public activeModal: NgbActiveModal, private treeService: TreeService, private userService: UserService ) { 
    
    this.subscription = this.treeService.getMessage().subscribe(message => {
      if(message != undefined) {
      
      }
    });
  }

  ngOnInit() {
    
    this.createForm();
    this.getTreeInformation();
  }

  private createForm() {
    
    this.treeEditForm = this.formBuilder.group(
      {
        titleEdit: ""
      });
  }

  getTreeInformation() {
      
    this.treeService.getInformationOne(this.rootId).toPromise().then(
      val => {

        let data = <any> val;
        console.log("data = ", data);
        if(data != null) {

          this.treeEditForm.patchValue({
            titleEdit: data.note.replace(/<[^>]*>/g, '')
          })

          this.information = data;
          console.log("where?", this.information);
        } 
      })
  
  }
  
  deleteTree() {

    /**
     * this.treeService.deleteNode(this.rootId).toPromise().then(
      () => {
        this.treeService.sendMessage("update_tree_list", null);
        this.activeModal.close('Close click');
      }
    )
     */

     this.treeService.deleteRootId(this.rootId, this.userService.getEmail()).toPromise().then(
       () => {
         this.treeService.sendMessage("update_tree_list", null);
         this.activeModal.close('Close click');
       }
     )
    
  }

  submitForm() {
    
    let title = this.treeEditForm.value.titleEdit;

    this.treeService.setTitle(this.rootId, title).subscribe(
      val => {
          console.log("PUT call successful value returned in body", val);
          this.treeService.sendMessage("update_tree_list", null);
      },
      response => {
          console.log("PUT call in error", response);
      },
      () => {
          console.log("The PUT observable is now completed.");
      });

      this.activeModal.close('Close click');
    }

}
