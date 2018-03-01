import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { RoomCreationComponent } from './dialogs/room-creation/room-creation.component';
import { SocketService } from '../socket/socket.service';
import { SnackService } from '../shared/snack.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-sidelist',
  templateUrl: './sidelist.component.html',
  styleUrls: ['./sidelist.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SidelistComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  private toggle: { message: string, room_deployed: boolean };
  private query: string;

  private friends: Friend[];
  private rooms: Room[];
  private current_room: string;

  get height_offset(): number {
    return this.toggle.room_deployed ? 151 : 111;
  }

  constructor(
    public dialog: MatDialog,
    private _socketService: SocketService,
    private _snackService: SnackService
  ) {
    this.toggle = { message: 'show friends', room_deployed: true };
    this.rooms = [];
    this.friends = [];
    this.current_room = null;
  }

  ngOnInit() {
    this._socketService.sidelist_stream
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        (res: { event: string, data: any }) => {
          switch (res.event) {
            case 'connected-friends':
              for (let i = 0; i < res.data.friends_status.length; i++) {
                this.friends.push({
                  username: res.data.friends_status[i].username,
                  online: res.data.friends_status[i].online
                });
              }
              break;
            case 'joined-rooms':
              if (res.data.rooms) {
                for (let i = 0; i < res.data.rooms.length; i++) {
                  this.rooms.push({
                    name: res.data.rooms[i].name,
                    id: res.data.rooms[i]._id,
                    date: res.data.rooms[i].date
                  });
                }
              }
              break;
            case 'connection-friend':
              const indexF = this.friends.findIndex(user => user.username === res.data.user);
              if (indexF >= 0) { this.friends[indexF].online = res.data.online; }
              break;
            case 'get-room-ack':
              this.current_room = res.data.room._id;
              break;
            case 'create-room-ack':
              this._socketService.joinRoomAction(res.data.room_id);
              this.rooms.push({
                name: res.data.room_name,
                id: res.data.room_id,
                date: res.data.room_date
              });
              this._snackService.generateSnack({ message: 'Room successfully created', action: 'Close', duration: 2000 });
              if (res.data.guests) {
                for (let i = 0; i < res.data.guests.length; i++) {
                  this._socketService.addGuestAction(res.data.room_id, res.data.guests[i]);
                }
              }
              break;
            case 'rename-room-ack':
              const indexRename = this.rooms.findIndex(room => room.id === res.data.room_id);
              if (indexRename >= 0) { this.rooms[indexRename].name = res.data.room_name; }
              break;
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
            case 'join-room-ack':

              break;
            case 'leave-room-ack':
              const indexR = this.rooms.findIndex(room => room.id === res.data.room_id);
              if (indexR >= 0) {
                if (this.current_room === res.data.room_id) {
                  this._socketService.mainMenu();
                }
                this._snackService.generateSnack({ message: `Successfully left room "${this.rooms[indexR].name}"`, action: 'Close', duration: 2000 });
                this.rooms.splice(indexR, 1);
              }
              break;
            case 'remove-friend':
              break;
            case 'added-room':
              this._socketService.joinRoomAction(res.data.room_id);
              this.rooms.push({
                name: res.data.room_name,
                id: res.data.room_id,
                date: res.data.room_date
              });
              break;
            case 'main-menu':
              this.current_room = null;
              break;
          }
        }
      );
  }

  onChangeRoom(id: string) {
    console.log('changing room', id);
    this._socketService.getRoomAction(id);
  }

  onChangeFriend(username: string) {
    console.log('changing friend', username);
  }

  openRoomDialog() {
    let dialogRef = this.dialog.open(RoomCreationComponent, {
      width: '350px',
      data: {
        friends: this.friends
      }
    });

    dialogRef.afterClosed().subscribe((res: { name: string, guests: string[] }) => {
      if (res && res.name) {
        if (res.guests && res.guests.length > 0) {
          this._socketService.createRoomAction(res.name, res.guests);
        } else {
          this._socketService.createRoomAction(res.name);
        }
      }
    });
  }

  switch() {
    this.toggle = this.toggle.room_deployed ? { message: 'show rooms', room_deployed: false } : { message: 'show friends', room_deployed: true };
    this.resetFilter();
  }

  resetFilter() {
    this.query = '';
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}

interface Friend {
  username: string;
  online: boolean;
}

interface Room {
  name: string;
  id: string;
  date: Date;
}
