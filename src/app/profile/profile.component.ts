import { Component, OnInit } from '@angular/core';
import { TreeService } from '../tree/tree.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  x = 10;
  y = 10;
  
  showProfileIcon = true;

  constructor(private treeService: TreeService) { }

  ngOnInit() {
  }
  
    /* Set the width of the side navigation to 250px */
  public openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    this.showProfileIcon = false;
  }
  
  /* Set the width of the side navigation to 0 */
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
  }

}
