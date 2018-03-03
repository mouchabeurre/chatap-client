import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './routing/app-routing.module';
import { JwtModule } from '@auth0/angular-jwt'
import { MaterialModule } from './material.module';

import { AuthGuard } from './routing/guards/auth.guard'

import { AuthService } from './shared/auth.service';
import { SocketService } from './socket/socket.service';
import { RoomContentService } from './room/room-content.service';
import { SnackService } from './shared/snack.service';

import { FriendfilterPipe } from './sidelist/pipes/friendfilter.pipe';
import { RoomfilterPipe } from './sidelist/pipes/roomfilter.pipe';
import { StreamDatePipe } from './shared/pipes/stream-date.pipe';

import { FullHeightDirective } from './shared/directives/full-height.directive';
import { ScrollDownStreamDirective } from './chat/scroll-down-stream.directive';
import { ShareChatVhDirective } from './chat/share-chat-vh.directive';

import { AppComponent } from './app.component';
import { ConnectComponent } from './connect/connect.component';
import { SigninComponent } from './connect/signin/signin.component';
import { SignupComponent } from './connect/signup/signup.component';
import { GlobalayoutComponent } from './globalayout/globalayout.component';
import { SidelistComponent } from './sidelist/sidelist.component';
import { RoomsComponent } from './sidelist/rooms/rooms.component';
import { FriendsComponent } from './sidelist/friends/friends.component';
import { RoomcontentComponent } from './room/roomcontent/roomcontent.component';
import { ThreadlistComponent } from './thread/threadlist/threadlist.component';
import { ChatComponent } from './chat/chat.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ThreadCreationComponent } from './thread/dialogs/thread-creation/thread-creation.component';
import { RoomCreationComponent } from './sidelist/dialogs/room-creation/room-creation.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { RoomManagerComponent } from './room/dialogs/room-manager/room-manager.component';
import { ToolbarTitleComponent } from './toolbar/toolbar-title/toolbar-title.component';
import { ToolbarAccountComponent } from './toolbar/toolbar-account/toolbar-account.component';
import { GuestlistComponent } from './guest/guestlist/guestlist.component';
import { ThreadManagerComponent } from './thread/dialogs/thread-manager/thread-manager.component';
import { GuestsAddComponent } from './guest/dialogs/guests-add/guests-add.component';
import { SnackGrowlerComponent } from './shared/snack-growler/snack-growler.component';
import { NotFoundComponent } from './not-found/not-found.component';

export function getToken(): string {
  return localStorage.getItem('access_token');
}

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
    ThreadManagerComponent,
    GuestsAddComponent,
    SnackGrowlerComponent,
    NotFoundComponent
  ],
  entryComponents: [
    RoomCreationComponent,
    ThreadCreationComponent,
    ConfirmDialogComponent,
    RoomManagerComponent,
    ThreadManagerComponent,
    GuestsAddComponent
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
        tokenGetter: getToken,
        whitelistedDomains: ['localhost:8080', 'messenjeur.herokuapp.com'],
        skipWhenExpired: true
      }
    })
  ],
  providers: [
    AuthGuard,
    AuthService,
    SocketService,
    RoomContentService,
    SnackService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
