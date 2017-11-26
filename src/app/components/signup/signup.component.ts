import { Component, OnInit, ViewEncapsulation, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AsyncValidatorFn,
  AbstractControl
} from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { SIGN_UP } from '../../models/auth-signup';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {
  private _response: SIGN_UP;

  private fg_username: FormGroup;
  private fg_email: FormGroup;
  private fg_pseudo: FormGroup;
  private fg_password: FormGroup;

  private username: FormControl;
  private email: FormControl;
  private pseudo: FormControl;
  private password: FormControl;
  private confirm_password: FormControl;

  get is_valid_username(): boolean { return this.username.errors && (this.username.dirty || this.username.touched); }
  get is_valid_email(): boolean { return this.email.errors && (this.email.dirty || this.email.touched); }
  get is_valid_pseudo(): boolean { return this.pseudo.errors && (this.pseudo.dirty || this.pseudo.touched); }
  get is_valid_password(): boolean { return this.password.errors && (this.password.dirty || this.password.touched); }
  get is_valid_confirm_password(): boolean { return this.confirm_password.errors && (this.confirm_password.dirty || this.confirm_password.touched); }
  
  private hide_p: boolean = true;
  private tooltip_pos_next: string = 'below';
  private tooltip_pos_prev: string = 'below';
  private tooltip_msg_next: string = 'Next step';
  private tooltip_msg_prev: string = 'Previous step';

  @Output() onSignup = new EventEmitter<SIGN_UP>();

  constructor(
    private _fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.createFormControls();
    this.createFormGroups();
  }

  createFormControls() {

    this.username = new FormControl(null, {
      validators: [Validators.required, Validators.pattern('[a-zA-Z0-9_-]+'), Validators.minLength(3), Validators.maxLength(20)],
      asyncValidators: [this.usernameAvailable(this.authService)]
    });
    this.email = new FormControl(null, {
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.emailValidation(this.authService)]
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

  usernameAvailable(authService: AuthService) {
    return (c: AbstractControl): Observable<any> => {
      return c.valueChanges.debounceTime(1500).distinctUntilChanged().switchMap(() => {
        return authService.usernameCheck(c.value).map(
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

  emailValidation(authService: AuthService): AsyncValidatorFn {
    return (c: AbstractControl): Observable<any> => {
      return c.valueChanges.debounceTime(1500).distinctUntilChanged().switchMap(() => {
        return authService.emailCheck(c.value).map(
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

  signup() {
    this._response.username = this.fg_username.controls.username.value;
    this._response.email = this.fg_email.controls.email.value;
    this._response.pseudo = this.fg_pseudo.controls.pseudo.value;
    this._response.password = this.fg_password.controls.password.value;
    this.onSignup.emit(this._response);
  }

}
