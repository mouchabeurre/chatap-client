import { Component, OnInit, ViewEncapsulation, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AsyncValidatorFn,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { SnackService } from '../../shared/snack.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { SIGN_UP } from '../../shared/models/auth-signup';
import { SNACK } from '../../shared/models/snack';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {
  private _response: SIGN_UP;

  public fg_username: FormGroup;
  public fg_email: FormGroup;
  public fg_pseudo: FormGroup;
  public fg_password: FormGroup;

  public username: FormControl;
  public email: FormControl;
  public pseudo: FormControl;
  public password: FormControl;
  public confirm_password: FormControl;

  get is_valid_username(): boolean { return this.username.errors && (this.username.dirty || this.username.touched); }
  get is_valid_email(): boolean { return this.email.errors && (this.email.dirty || this.email.touched); }
  get is_valid_pseudo(): boolean { return this.pseudo.errors && (this.pseudo.dirty || this.pseudo.touched); }
  get is_valid_password(): boolean { return this.password.errors && (this.password.dirty || this.password.touched); }
  get is_valid_confirm_password(): boolean { return this.confirm_password.errors && (this.confirm_password.dirty || this.confirm_password.touched); }

  public hide_p: boolean = true;
  public tooltip_pos_next: string = 'below';
  public tooltip_pos_prev: string = 'below';
  public tooltip_msg_next: string = 'Next step';
  public tooltip_msg_prev: string = 'Previous step';

  @Output() onSignup = new EventEmitter<SIGN_UP>();

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _snackService: SnackService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.createFormControls();
    this.createFormGroups();
  }

  createFormControls() {

    this.username = new FormControl(null, {
      validators: [Validators.required, Validators.pattern('[a-zA-Z0-9_-]+'), Validators.minLength(3), Validators.maxLength(20)],
      asyncValidators: [this.usernameAvailable(this._authService)]
    });
    this.email = new FormControl(null, {
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.emailValidation(this._authService)]
    });
    this.pseudo = new FormControl(null, {
      validators: [Validators.required, Validators.pattern('[a-zA-Z0-9_-]+'), Validators.minLength(3), Validators.maxLength(20)]
    });
    this.password = new FormControl(null, {
      validators: [Validators.required, Validators.minLength(6)]
    });
    this.confirm_password = new FormControl(null, {
      validators: [Validators.required, this.matchingPasswords()]
    });
  }

  createFormGroups() {
    this.fg_username = this._fb.group({
      username: this.username
    });
    this.fg_email = this._fb.group({
      email: this.email
    });
    this.fg_pseudo = this._fb.group({
      pseudo: this.pseudo
    });
    this.fg_password = this._fb.group({
      password: this.password,
      confirm_password: this.confirm_password
    });
  }

  usernameAvailable(_authService: AuthService) {
    return (c: AbstractControl): Observable<any> => {
      return c.valueChanges.debounceTime(1500).distinctUntilChanged().switchMap(() => {
        return _authService.usernameCheck(c.value).map(
          res => {
            if (!res.available) {
              c.setErrors({ unavailable: true });
              return Observable.of({ unavailable: true });
            } else {
              c.setErrors(null);
              return Observable.of(null);
            }
          },
          err => {
            c.setErrors({ cannot_check: true });
            return Observable.of({ cannot_check: true });
          });
      });
    }
  }

  emailValidation(_authService: AuthService): AsyncValidatorFn {
    return (c: AbstractControl): Observable<any> => {
      return c.valueChanges.debounceTime(1500).distinctUntilChanged().switchMap(() => {
        return _authService.emailCheck(c.value).map(
          res => {
            if (!res.available) {
              c.setErrors({ unavailable: true });
              return Observable.of({ unavailable: true });
            } else {
              c.setErrors(null);
              return Observable.of(null);
            }
          },
          err => {
            c.setErrors({ cannot_check: true });
            return Observable.of({ cannot_check: true });
          });
      });
    }
  }

  matchingPasswords() {
    return (c: AbstractControl) => {
      if (!c.parent) {
        return null;
      } else {
        if (c.value !== c.parent.get('password').value) {
          return ({ mismatch: true });
        } else {
          return null;
        }
      }
    }
  }

  onSubmit() {
    this._response = {
      username: this.fg_username.controls.username.value,
      email: this.fg_email.controls.email.value,
      pseudo: this.fg_pseudo.controls.pseudo.value,
      password: this.fg_password.controls.password.value
    };
    this._authService.register(this._response).subscribe(
      data => {
        this._snackService.generateSnack({ message: 'Account successfully created', action: 'Close', duration: 2000 });
        this._router.navigate(['/connect/signin']);
      },
      err => {
        // console.log('Something went wrong!', err);
      }
    );
  }

}
