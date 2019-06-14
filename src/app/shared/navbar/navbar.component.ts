
import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    userName = localStorage.getItem('userName');
    constructor(private _router: Router) {

    }

    ngOnInit() {
    }

    logout() {
        this._router.navigateByUrl('/login')
    }
}
