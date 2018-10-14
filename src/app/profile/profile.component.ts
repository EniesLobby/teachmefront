import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  x = 10;
  y = 10;
  
  showProfileIcon = true;

  constructor() { }

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

}
