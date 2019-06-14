import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-loginregister',
  templateUrl: './loginregister.component.html',
  styleUrls: ['./loginregister.component.css']
})
export class LoginregisterComponent implements OnInit {

  username: any = '';
  Password: any = '';
  errorMessage: string;

  click() {
    this._router.navigateByUrl('/signup');
  }
  constructor(private _router: Router, private apis: RestService) {
  }

  submit() {
    console.log("calling");
    console.log(this.username, this.Password);
    let input = {
      name: this.username,
      password: this.Password
    }

    this.apis.login(input).subscribe((response) => {
      if (response.success) {
        localStorage.setItem('userName', this.username);
        localStorage.setItem('email', response.email);
        console.log("success")
        this._router.navigateByUrl('/dashboard/bookings');
      } else {
        this.errorMessage = 'Invalid username or password';
        alert(response.message)
      }
    })

    // if (this.username === 'satya' && this.Password === '1234') {
    //   this.errorMessage = ''
    //   console.log(this.username + '' + this.Password);
    //   localStorage.setItem('isLoggedIn', this.username);
    //   this._router.navigateByUrl('/dashboard/bookings');
    // }
    // else if (this.username === 'sri' && this.Password === '1998') {
    //   this.errorMessage = ''
    //   console.log(this.username + '' + this.Password);
    //   localStorage.setItem('isLoggedIn', this.username);
    //   this._router.navigateByUrl('/dashboard/bookings');
    // }
    // else {
    //   this.errorMessage = 'Invalid Username or Password'
    // }
  }
  signup() {
    this._router.navigateByUrl('signup');
  }

  ngOnInit() {
  }

}
