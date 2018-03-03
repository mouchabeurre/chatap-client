import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { SIGN_IN } from '../../shared/models/auth-signin';
import { SnackService } from '../../shared/snack.service';
import { SNACK } from '../../shared/models/snack';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SigninComponent implements OnInit {
  private _response: SIGN_IN;

  public fg_username: FormGroup;
  public fg_password: FormGroup;

  public username: FormControl;
  public password: FormControl;

  get is_valid_username(): boolean { return this.username.errors && (this.username.dirty || this.username.touched); }
  get is_valid_password(): boolean { return this.password.errors && (this.password.dirty || this.password.touched); }

  public tooltip_pos_next: string = 'below';
  public tooltip_pos_prev: string = 'below';
  public tooltip_msg_next: string = 'Next step';
  public tooltip_msg_prev: string = 'Previous step';

  constructor(
    private _authService: AuthService,
    private _fb: FormBuilder,
    private _snackService: SnackService,
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
        if (data.success) {
          this._authService.storeToken(data.token);
          this._router.navigate(['/home']);
        } else {
          this._snackService.generateSnack({ message: 'Wrong username or password', action: 'Close', duration: 2000 });
          this.password.reset();
        }
      },
      err => {
        this._snackService.generateSnack({ message: 'Wrong username or password', action: 'Close', duration: 2000 });
        this.password.reset();
      }
    );
  }

}
