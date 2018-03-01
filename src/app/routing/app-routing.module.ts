import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { ConnectComponent } from '../connect/connect.component';
import { SigninComponent } from '../connect/signin/signin.component';
import { SignupComponent } from '../connect/signup/signup.component';
import { GlobalayoutComponent } from '../globalayout/globalayout.component';
import { NotFoundComponent } from '../not-found/not-found.component';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'connect',
    pathMatch: 'full'
  },
  {
    path: 'connect',
    component: ConnectComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'signin'
      },
      {
        path: 'signin',
        component: SigninComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      }
    ]
  },
  {
    path: 'home',
    component: GlobalayoutComponent,
    canActivate: [AuthGuard],
    children: []
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }