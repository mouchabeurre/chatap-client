import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ThreadCreationComponent } from '../thread-creation/thread-creation.component';
import { GuestsAddComponent } from '../guests-add/guests-add.component';
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

  get guestHeight(): number {
    if (this._rcService.isSuperGuest) {
      return 126
    }
    return 70;
  }

  get threadHeight(): number {
    if (this._rcService.isSuperGuest) {
      return 110
    }
    return 70;
  }

  private gAction: typeof gActions;

  constructor(
    public dialog: MatDialog,
    private _rcService: RoomContentService,
    private _socketService: SocketService
  ) {
    this.gAction = gActions;
  }

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

  openGuestsDialog(action: gActions) {
    let dialogClass: any;
    let width: string = '400px';
    let maxHeight: string = '600px';
    let data: any = {}
    switch (action) {
      case gActions.add:
        dialogClass = GuestsAddComponent;
        break;
      case gActions.remove:
        break;
      case gActions.whitelist:
        break;
    }
    let dialogRef = this.dialog.open(dialogClass, {
      width: width,
      maxHeight: maxHeight,
      data: data
    });

    dialogRef.afterClosed().subscribe((res: { action: gActions, selected: string[] }) => {
      if (res && res.action && res.selected && res.selected.length > 0) {
        switch (res.action) {
          case gActions.add:
            res.selected.map(user => {
              this._socketService.addGuestAction(this._rcService.room.id, user);
            });
            break;
          case gActions.remove:
            break;
          case gActions.whitelist:
            break;
        }
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

enum gActions {
  add = 'add',
  remove = 'remove',
  whitelist = 'whitelist'
}
