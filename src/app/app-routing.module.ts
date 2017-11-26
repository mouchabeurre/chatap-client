import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { ConnectComponent } from './components/connect/connect.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';


const appRoutes: Routes = [
  {
    path: 'connect',
    component: ConnectComponent,
    children: [
      {
        path: 'signin',
        component: SigninComponent,
        outlet: 'signin'
      },
      {
        path: 'signup',
        component: SignupComponent,
        outlet: 'signup'
      }
    ]
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