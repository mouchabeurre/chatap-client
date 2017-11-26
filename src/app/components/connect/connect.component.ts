import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SIGN_IN } from '../../models/auth-signin';
import { SIGN_UP } from '../../models/auth-signup';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConnectComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSignin(response: SIGN_IN) {
    this.authService.authenticate(response).subscribe(
      data => {
        console.log('logged in', data);
      },
      err => {
        console.log('Something went wrong!', err);
      }
    );
  }

  onSignup(response: SIGN_UP) {
    this.authService.authenticate(response).subscribe(
      data => {
        console.log('registered', data);
      },
      err => {
        console.log('Something went wrong!', err);
      }
    );
  }

}
