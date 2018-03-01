import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { SIGN_IN } from '../../shared/models/auth-signin';

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

  get is_valid_username(): boolean { return this.username.errors && (this.username.dirty || this.username.touched); }
  get is_valid_password(): boolean { return this.password.errors && (this.password.dirty || this.password.touched); }

  private tooltip_pos_next: string = 'below';
  private tooltip_pos_prev: string = 'below';
  private tooltip_msg_next: string = 'Next step';
  private tooltip_msg_prev: string = 'Previous step';

  constructor(
    private _authService: AuthService,
    private _fb: FormBuilder,
    private _router: Router
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

  onSubmit() {
    this._response = {
      username: this.fg_username.controls.username.value,
      password: this.fg_password.controls.password.value
    };
    this._authService.authenticate(this._response).subscribe(
      data => {
        this._authService.storeToken(data.token);
        this._router.navigate(['/home']);
      },
      err => {
        console.log('Something went wrong!', err);
      }
    );
  }

}
