import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt'
import 'rxjs/add/operator/map';

import { SIGN_IN } from '../models/auth-signin';
import { SIGN_UP } from '../models/auth-signup';
import { AUTHENTICATE, AVAILABLE, REGISTER } from '../models/server-res';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService
  ) { }

  authenticate(user: SIGN_IN) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<AUTHENTICATE>('/user/authenticate', user, { headers: headers });
  }

  register(user: SIGN_UP) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<REGISTER>('/user/register', user, { headers: headers });
  }

  usernameCheck(username: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get<AVAILABLE>(`http://localhost:8080/api/user/usernamecheck/${username}`, { headers: headers });
  }

  emailCheck(email: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get<AVAILABLE>(`http://localhost:8080/api/user/usernamecheck/${email}`, { headers: headers });
  }

  storeToken(token) {
    localStorage.setItem('access_token', token);
  }

  getUser() {
    const token: string = this.jwtHelperService.tokenGetter();
    return this.jwtHelperService.decodeToken(token);
  }

  loggedIn() {
    const token: string = this.jwtHelperService.tokenGetter();
    if (!token) {
      return false;
    } else {
      const tokenExpired: boolean = this.jwtHelperService.isTokenExpired(token);
      return !tokenExpired;
    }
  }

  clearToken() {
    localStorage.removeItem('access_token');
  }
}
