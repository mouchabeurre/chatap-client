import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './routing/app-routing.module';
import { JwtModule } from '@auth0/angular-jwt'
import { MaterialModule } from './material.module';

import { AuthGuard } from './guards/auth.guard'

import { AuthService } from './services/auth.service';

import { AppComponent } from './app.component';
import { ConnectComponent } from './components/connect/connect.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { GlobalayoutComponent } from './components/globalayout/globalayout.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectComponent,
    SigninComponent,
    SignupComponent,
    GlobalayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        },
        whitelistedDomains: ['localhost:8080'],
        skipWhenExpired: true
      }
    })
  ],
  providers: [
    AuthGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
