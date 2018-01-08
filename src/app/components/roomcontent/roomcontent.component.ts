import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ThreadCreationComponent } from '../thread-creation/thread-creation.component';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { ROOM } from '../../models/room';
import { THREAD } from '../../models/thread';

@Component({
  selector: 'app-roomcontent',
  templateUrl: './roomcontent.component.html',
  styleUrls: ['./roomcontent.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RoomcontentComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  private room: ROOM;
  private thread: THREAD;
  private guests: { user: string, privilege: string, status: gStatus }[];

  get room_id(): string {
    if (!this.room) {
      return null;
    }
    return this.room.id;
  }

  get room_threads(): { _id: string, title: string }[] | null {
    if (!this.room) {
      return null;
    }
    return this.room.threads;
  }

  get room_mainthread(): { _id: string, title: string } | null {
    if (!this.room) {
      return null;
    }
    return this.room.mainthread;
  }

  get thread_id(): string | null {
    if (!this.thread) {
      return null;
    }
    return this.thread._id;
  }

  get is_super_guest(): boolean {
    const index = this.room.guests.findIndex(guest => guest.user === this._authService.user.userIdentity);
    return this.room.guests[index].privilege !== 'basic';
  }

  get room_guests(): { user: string, privilege: string }[] | null {
    if (!this.room) {
      return null;
    }
    return this.guests;
  }

  constructor(
    public dialog: MatDialog,
    private _authService: AuthService,
    private socketService: SocketService
  ) {
    this.room = null;
    this.thread = null;
    this.guests = [];
  }

  ngOnInit() {
    this.socketService.roomcontent_stream
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
      (res: { event: string, data: any }) => {
        switch (res.event) {
          case 'connection-guest':
            if (this.room !== null && this.room.id === res.data.room_id) {
              const i = this.guests.findIndex(guest => guest.user === res.data.user);
              if (i > -1) {
                this.guests[i].status = res.data.online ? gStatus.online : gStatus.offline;;
              }
            }
            break;
          case 'get-room-ack':
            this.room = res.data.room;
            this.thread = null;
            this.guests = [];
            for (let i = 0; i < res.data.room.guests.length; i++) {
              this.guests.push({
                user: res.data.room.guests[i].user,
                privilege: res.data.room.guests[i].privilege,
                status: gStatus.offline
              });
            }
            break;
          case 'get-guests-ack':
            res.data.guests.map(guest => {
              const i = this.guests.findIndex(thisGuest => thisGuest.user === guest.user);
              this.guests[i].status = guest.status ? gStatus.online : gStatus.offline;
            });
            break;
          case 'rename-room-ack':
            if (this.room !== null && this.room.id === res.data.room_id) {
              this.room.name = res.data.room_name;
            }
            break;
          case 'create-thread-ack':
            break;
          case 'get-thread-ack':
            this.thread = res.data.thread;
            break;
          case 'thread-renamed':
            if (this.room !== null && this.room.id === res.data.room_id) {
              const indexT = this.room.threads.findIndex(thread => thread._id === res.data.thread_id);
              if (indexT < 0) {
                this.room.mainthread.title = res.data.thread_name
              } else {
                this.room.threads[indexT].title = res.data.thread_name;
              }
              if (this.thread !== null && this.thread._id === res.data.thread_id) {
                this.thread.title = res.data.thread_name;
              }
            }
            break;
          case 'deleted-thread':
            if (this.room !== null && this.room.id === res.data.room_id) {
              const indexT = this.room.threads.findIndex(thread => thread._id === res.data.thread_id);
              if (this.thread._id === res.data.thread_id) {
                this.thread = null;
              }
              this.room.threads.splice(indexT, 1);
            }
            break;
          case 'new-thread':
            if (this.room !== null && this.room.id === res.data.room_id) {
              this.room.threads.push({ _id: res.data._id, title: res.data.title });
            }
            break;
          case 'send-thread-ack':
            break;
          case 'new-message':
            if (this.room !== null && this.room.id === res.data.room_id && this.thread._id === res.data.thread_id) {
              this.thread.feed.push(res.data.message);
            }
            break;
          case 'new-guest':
            break;
          case 'join-room-ack':
            break;
          case 'remove-guest-ack':
            break;
          case 'left-guest':
            break;
          case 'main-menu':
            this.room = this.thread = this.guests = null;
            break;
        }
      }
      )
  }

  onChangeThread(thread_id: string) {
    console.log('changing thread', thread_id);
    this.socketService.getThreadAction(this.room.id, thread_id);
  }

  onSendMessage(loadout: { content: string, media: string }) {
    console.log('sending message', loadout.content);
    this.socketService.sendThreadAction(loadout.content, this.room.id, this.thread._id, loadout.media);
  }

  openThreadDialog() {
    let dialogRef = this.dialog.open(ThreadCreationComponent, {
      width: '350px',
      data: {
        room_name: this.room.name,
        room_id: this.room.id
      }
    });

    dialogRef.afterClosed().subscribe((res: { name: string }) => {
      if (res && res.name) {
        this.socketService.createThreadAction(res.name, this.room.id)
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}

enum gStatus {
  offline = 'offline',
  online = 'online',
  busy = 'busy',
  away = 'away'
}
