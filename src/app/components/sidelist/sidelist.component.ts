import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { RoomcreationdialogComponent } from '../roomcreationdialog/roomcreationdialog.component'
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-sidelist',
  templateUrl: './sidelist.component.html',
  styleUrls: ['./sidelist.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SidelistComponent implements OnInit {

  private myInnerHeight: number;
  private toggle: { message: string, room_deployed: boolean };
  private query: string;

  private friends: Friend[];
  private rooms: Room[];
  private current_room: string;

  @ViewChild(RoomcreationdialogComponent)
  private createDialog: RoomcreationdialogComponent;

  constructor(
    private socketService: SocketService
  ) {
    this.myInnerHeight = window.innerHeight - 152;
    this.toggle = { message: 'show friends', room_deployed: true };
    this.rooms = [];
    this.friends = [];
  }

  ngOnInit() {
    // for (let i = 0; i < 15; i++) {
    //   this.friends.push({
    //     username: 'jdoe' + i,
    //     online: true
    //   });
    //   this.rooms.push({
    //     name: 'room name' + i,
    //     id: 'z56z3er3z14' + i + 1
    //   });
    // }
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
            for (let i = 0; i < res.data.rooms.length; i++) {
              this.rooms.push({
                name: 'oui',
                id: res.data.rooms[i]
              });
            }
            break;
          case 'connection-friend':
            const index = this.friends.findIndex(user => user.username === res.data.user);
            this.friends[index].online = res.data.online;
            break;
          case 'create-room-ack':
            this.rooms.push({
              name: 'new',
              id: res.data.room_id
            });
            if (res.data.guests) {
              for (let i = 0; i < res.data.guests.length; i++) {
                this.socketService.addGuestAction(res.data.room_id, res.data.guests[i]);
              }
            }
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
          case 'remove-friend':
            break;
          case 'added-room':
            this.rooms.push({
              name: 'new',
              id: res.data.room_id
            });
            break;
        }
      }
    )
  }

  onChangeRoom(id: string) {
    console.log('changing room', id);
    this.socketService.getRoomAction(id);
    this.current_room = id;
  }

  onChangeFriend(username: string) {
    console.log('changing friend', username);
  }

  newRoom() {
    this.createDialog.openDialog();
  }

  switch() {
    this.toggle = this.toggle.room_deployed ? { message: 'show rooms', room_deployed: false } : { message: 'show friends', room_deployed: true };
    this.resetFilter();
  }

  resetFilter() {
    this.query = '';
  }

  onResize(event) {
    this.myInnerHeight = event.target.innerHeight - 152;
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
