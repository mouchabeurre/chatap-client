import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ThreadCreationComponent } from '../thread-creation/thread-creation.component';
import { RoomContentService } from '../../services/room-content.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-roomcontent',
  templateUrl: './roomcontent.component.html',
  styleUrls: ['./roomcontent.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RoomcontentComponent implements OnInit {
  get room(): boolean {
    if (this._rcService.room) {
      return true;
    }
    return false;
  }

  get thread(): boolean {
    if (this._rcService.thread) {
      return true;
    }
    return false;
  }

  get isSuperGuest(): boolean {
    return this._rcService.isSuperGuest;
  }

  constructor(
    public dialog: MatDialog,
    private _rcService: RoomContentService,
    private _socketService: SocketService
  ) { }

  ngOnInit() { }

  openThreadDialog() {
    let dialogRef = this.dialog.open(ThreadCreationComponent, {
      width: '350px',
      data: {
        room_name: this._rcService.room.name,
        room_id: this._rcService.room.id
      }
    });

    dialogRef.afterClosed().subscribe((res: { name: string }) => {
      if (res && res.name) {
        this._socketService.createThreadAction(res.name, this._rcService.room.id)
      }
    });
  }

}

enum gStatus {
  offline = 'offline',
  online = 'online',
  busy = 'busy',
  away = 'away'
}
