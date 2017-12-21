import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { RoomManagerComponent } from '../room-manager/room-manager.component';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  private room: { id: string, name: string, owner: string };
  private thread: { id: string, title: string };

  get is_owner(): boolean {
    return this.room.owner == this._authService.user.userIdentity ? true : false;
  }

  constructor(
    public dialog: MatDialog,
    private _authService: AuthService,
    private socketService: SocketService
  ) {
    this.room = { id: null, name: null, owner: null };
    this.thread = { id: null, title: null };
  }

  ngOnInit() {
    this.socketService.toolbar_stream.subscribe(
      (res: { event: string, data: any }) => {
        switch (res.event) {
          case 'get-room-ack':
            this.room.id = res.data.room._id;
            this.room.name = res.data.room.name;
            this.room.owner = res.data.room.owner;
            break;
          case 'get-thread-ack':
            this.thread.id = res.data.thread._id;
            this.thread.title = res.data.thread.title;
            break;
          case 'rename-room-ack':
            if (this.room.id == res.data.room_id) {
              this.room.name = res.data.room_name;
            }
            break;
          // notification hub
          case 'send-friend-request-ack':
            break;
          case 'friend-request':
            break;
          case 'reply-friend-request-ack':
            break;
          case 'response-friend-request':
            break;
          case 'block-user-ack':
            break;
          case 'remove-friend':
            break;
          case 'add-guest-ack':
            break;
          case 'added-room':
            break;
          case 'join-room-ack':
            break;
          case 'remove-guest-ack':
            break;
          case 'left-guest':
            break;
          case 'main-menu':
            this.room = { id: null, name: null, owner: null };
            this.thread = { id: null, title: null };
            break;
        }
      }
    );
  }

  openConfirmLeave() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        description: `You are about to leave room "${this.room.name}" (ID: "${this.room.id}"). By doing so you won\'t recieve messages from this room anymore.`,
        confirm_statement: 'Please confirm that you want to leave.'
      }
    });

    dialogRef.afterClosed().subscribe((res: { confirmed: boolean }) => {
      if (res && res.confirmed) {
        this.socketService.leaveRoomAction(this.room.id);
      }
    });
  }

  openRoomNameEditor() {
    let dialogRef = this.dialog.open(RoomManagerComponent, {
      width: '350px',
      data: {
        action: 'rename',
        title: 'Edit room name',
        room_name: this.room.name
      }
    });

    dialogRef.afterClosed().subscribe((res: { room_name: string }) => {
      if (res && res.room_name && res.room_name !== this.room.name) {
        this.socketService.renameRoomAction(this.room.id, res.room_name);
      }
    });
  }

}
