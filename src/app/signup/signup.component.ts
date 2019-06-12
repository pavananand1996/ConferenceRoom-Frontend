import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  username: any;
  register: any;
  addUser: any;

  constructor(private _router: Router) { }
  click() {
    this._router.navigateByUrl('/loginregister');
  }
  signup() {
    alert('successfully Rgistered');
    this._router.navigateByUrl('/loginregister');
    var newUser = {
      "e-mail": this.username,
      //based on api
    }
    this.register.addCandidate(newUser).subscribe(result => {
      console.log(result);
      this.addUser = result;
      console.log("candidate details are:", this.addUser)
    })
  }
  login() {
    this._router.navigateByUrl('/loginregister');
  }

  ngOnInit() {
  }

}
