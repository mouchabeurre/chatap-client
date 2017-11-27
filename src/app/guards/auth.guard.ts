import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }
  
  canActivate(): boolean {
    if (this.auth.loggedIn()) {
      return true;
    } else {
      localStorage.removeItem('access_token');
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
