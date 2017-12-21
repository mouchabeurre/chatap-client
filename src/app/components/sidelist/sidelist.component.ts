import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { RoomCreationComponent } from '../room-creation/room-creation.component';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-sidelist',
  templateUrl: './sidelist.component.html',
  styleUrls: ['./sidelist.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SidelistComponent implements OnInit {

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
    private socketService: SocketService
  ) {
    this.toggle = { message: 'show friends', room_deployed: true };
    this.rooms = [];
    this.friends = [];
    this.current_room = null;
  }

  ngOnInit() {
    this.socketService.sidelist_stream.subscribe(
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
                  id: res.data.rooms[i]._id
                });
              }
            }
            break;
          case 'connection-friend':
            const indexF = this.friends.findIndex(user => user.username === res.data.user);
            this.friends[indexF].online = res.data.online;
            break;
          case 'get-room-ack':
            this.current_room = res.data.room._id;
            break;
          case 'create-room-ack':
            this.socketService.joinRoomAction(res.data.room_id);
            this.rooms.push({
              name: res.data.room_name,
              id: res.data.room_id
            });
            if (res.data.guests) {
              for (let i = 0; i < res.data.guests.length; i++) {
                this.socketService.addGuestAction(res.data.room_id, res.data.guests[i]);
              }
            }
            break;
          case 'rename-room-ack':
            const indexRename = this.rooms.findIndex(room => room.id === res.data.room_id);
            this.rooms[indexRename].name = res.data.room_name;
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
            if (this.current_room === res.data.room_id) {
              this.socketService.mainMenu();
            }
            this.current_room = null;
            this.rooms.splice(indexR, 1);
            break;
          case 'remove-friend':
            break;
          case 'added-room':
            this.socketService.joinRoomAction(res.data.room_id);
            this.rooms.push({
              name: res.data.room_name,
              id: res.data.room_id
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
    this.socketService.getRoomAction(id);
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
          this.socketService.createRoomAction(res.name, res.guests);
        } else {
          this.socketService.createRoomAction(res.name);
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

}

interface Friend {
  username: string;
  online: boolean;
}

interface Room {
  name: string;
  id: string;
}
