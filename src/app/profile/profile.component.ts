import { Component, OnInit } from '@angular/core';
import { TreeService } from '../tree/tree.service';
import { UserService } from '../UserService.service';

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

  constructor(private treeService: TreeService,  private userService: UserService) { }

  ngOnInit() {
    this.getUser();
  }

  public viewTree(rootId) {
    console.log(rootId);
  }
  
  public openNav() {

    this.treeService.sendMessage("showHelperProfile", false);
    document.getElementById("mySidenav").style.width = "300px";
    this.showProfileIcon = false;
  }
  
  public closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    this.showProfileIcon = true;
  }
  
  public createTree() {
    this.treeService.createTree().subscribe(
      val => {
          console.log("POST call successful value returned in body", 
                      val);
          this.treeService.sendMessage("rootId", val);
          this.treeService.sendMessage("showRootHelper", val);
      },
      response => {
          console.log("POST call in error", response);
      },
      () => {
          console.log("The POST observable is now completed.");
      });
  }
  
  public deleteAllNodes() {
    this.treeService.deleteAllNodes();
    this.treeService.sendMessage("refresh", null);
  }

  public async getUser() {
    await this.treeService.getUser(this.userService.getEmail()).toPromise().then(
      val => {
        this.user = JSON.parse(val);
        this.getInformation();
      }
    )
  }

  public async getInformation() {
    
    let current_rootId;

    console.log(this.user);
    for(var i = 0; i < this.user.treeRootIds.length; i ++ ) {
      current_rootId = this.user.treeRootIds[i];
      await this.treeService.getInformationOne(this.user.treeRootIds[i]).toPromise().then(
        val => {
          var data = val;
          this.rootId_title.push({
            rootId:  current_rootId,
            title: data
          })
          this.showTrees = true;
        }
      )
    }

    console.log(this.rootId_title);
  }

}
