import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SIGN_IN } from '../shared/models/auth-signin';
import { SIGN_UP } from '../shared/models/auth-signup';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConnectComponent implements OnInit {
  public navLinks: { path: string, label: string }[];

  constructor(
    private router: Router
  ) {
    this.navLinks = [{ path: 'signin', label: 'signin' }, { path: 'signup', label: 'signup' }];
  }

  ngOnInit() {
  }

}
