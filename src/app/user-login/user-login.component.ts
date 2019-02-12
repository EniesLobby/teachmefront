import { Component, OnInit } from '@angular/core';
import { TreeService } from '../tree/tree.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../UserService.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private treeService: TreeService, 
              private formBuilder: FormBuilder, 
              private router: Router,
              private userService: UserService) {

    this.createForm();
  }
  
  private createForm() {
    this.loginForm = this.formBuilder.group(
      {
        email: "",
        password: ""
      });
  }

  ngOnInit() {
  
  }

  submitForm() {

    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;

    if(email != "" && password != "") {
      this.treeService.checkUser(email, password).subscribe(
        val => {
            console.log("POST call successful value returned in body", val);
            if(val) {
              this.router.navigateByUrl('tree');
              this.treeService.sendMessage("login", email);
              this.userService.setToken(email);
            }
        },
        response => {
            console.log("POST call in error", response);
        },
        () => {
            console.log("The POST observable is now completed.");
        }
      );
    }
  }
}
