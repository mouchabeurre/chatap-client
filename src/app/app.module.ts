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
import { SocketService } from './services/socket.service'

import { AppComponent } from './app.component';
import { ConnectComponent } from './components/connect/connect.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { GlobalayoutComponent } from './components/globalayout/globalayout.component';
import { SidelistComponent } from './components/sidelist/sidelist.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { FriendsComponent } from './components/friends/friends.component';
import { RoomcontentComponent } from './components/roomcontent/roomcontent.component';
import { FriendfilterPipe } from './pipes/friendfilter.pipe';
import { RoomfilterPipe } from './pipes/roomfilter.pipe';
import { ThreadlistComponent } from './components/threadlist/threadlist.component';
import { ChatComponent } from './components/chat/chat.component';
import { StreamDatePipe } from './pipes/stream-date.pipe';
import { ShareChatVhDirective } from './directives/share-chat-vh.directive';
import { FullHeightDirective } from './directives/full-height.directive';
import { ScrollDownStreamDirective } from './directives/scroll-down-stream.directive';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ThreadCreationComponent } from './components/thread-creation/thread-creation.component';
import { RoomCreationComponent } from './components/room-creation/room-creation.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { RoomManagerComponent } from './components/room-manager/room-manager.component';
import { ToolbarTitleComponent } from './components/toolbar-title/toolbar-title.component';
import { ToolbarAccountComponent } from './components/toolbar-account/toolbar-account.component';
import { GuestlistComponent } from './components/guestlist/guestlist.component';
import { ThreadManagerComponent } from './components/thread-manager/thread-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectComponent,
    SigninComponent,
    SignupComponent,
    GlobalayoutComponent,
    SidelistComponent,
    RoomsComponent,
    FriendsComponent,
    RoomcontentComponent,
    FriendfilterPipe,
    RoomfilterPipe,
    ThreadlistComponent,
    ChatComponent,
    StreamDatePipe,
    ShareChatVhDirective,
    FullHeightDirective,
    ScrollDownStreamDirective,
    ToolbarComponent,
    ThreadCreationComponent,
    RoomCreationComponent,
    ConfirmDialogComponent,
    RoomManagerComponent,
    ToolbarTitleComponent,
    ToolbarAccountComponent,
    GuestlistComponent,
    ThreadManagerComponent
  ],
  entryComponents: [
    RoomCreationComponent,
    ThreadCreationComponent,
    ConfirmDialogComponent,
    RoomManagerComponent,
    ThreadManagerComponent
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
    AuthService,
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
