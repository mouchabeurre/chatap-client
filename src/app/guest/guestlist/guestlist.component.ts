import { Component, Input, OnInit } from '@angular/core';
import { RoomContentService } from '../../room/room-content.service';
import { AuthService } from '../../shared/auth.service';
import { SocketService } from '../../socket/socket.service';

@Component({
  selector: 'app-guestlist',
  templateUrl: './guestlist.component.html',
  styleUrls: ['./guestlist.component.css']
})
export class GuestlistComponent implements OnInit {
  private status: typeof gStatus;

  get guests(): { user: string, privilege: string, status: gStatus }[] | null {
    return !this._rcService.room ? null : this._rcService.guests;
  }

  constructor(
    private _authService: AuthService,
    private _rcService: RoomContentService,
    private _socketService: SocketService
  ) {
    this.status = gStatus;
  }

  ngOnInit() {
  }

}

enum gStatus {
  offline = 'offline',
  online = 'online',
  busy = 'busy',
  away = 'away'
}