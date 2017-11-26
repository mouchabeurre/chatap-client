import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SIGN_IN } from '../../models/auth-signin';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SigninComponent implements OnInit {
  private _response: SIGN_IN;

  private fg_username: FormGroup;
  private fg_password: FormGroup;

  private username: FormControl;
  private password: FormControl;

  @Output() onSignin = new EventEmitter<SIGN_IN>();

  constructor(
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createFormControls();
    this.createFormGroups();
  }

  createFormControls() {
    this.username = new FormControl(null, {
      validators: [Validators.required]
    });
    this.password = new FormControl(null, {
      validators: [Validators.required]
    });
  }

  createFormGroups() {
    this.fg_username = this._fb.group({
      username: this.username,
    });
    this.fg_password = this._fb.group({
      password: this.password,
    });
  }

  signin() {
    this._response.username = this.fg_username.controls.username.value;
    this._response.password = this.fg_password.controls.password.value;
    this.onSignin.emit(this._response);
  }

}
