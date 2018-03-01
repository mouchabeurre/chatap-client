import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { RoomManagerComponent } from '../../room/dialogs/room-manager/room-manager.component';
import { SocketService } from '../../socket/socket.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-toolbar-title',
  templateUrl: './toolbar-title.component.html',
  styleUrls: ['./toolbar-title.component.css']
})
export class ToolbarTitleComponent implements OnInit {

  @Input() room: { id: string, name: string, owner: string };

  get is_owner(): boolean {
    return this.room.owner == this._authService.user.userIdentity ? true : false;
  }

  constructor(
    public dialog: MatDialog,
    private socketService: SocketService,
    private _authService: AuthService
  ) { }

  ngOnInit() {
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

  openConfirmDelete() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        description: `You are about to delete room "${this.room.name}" (ID: "${this.room.id}").`,
        confirm_statement: 'Please confirm the deletion.'
      }
    });

    dialogRef.afterClosed().subscribe((res: { confirmed: boolean }) => {
      if (res && res.confirmed) {

      }
    });
  }

}
