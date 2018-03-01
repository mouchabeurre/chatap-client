import { Injectable, OnDestroy } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { AuthService } from '../shared/auth.service';
import { SnackService } from '../shared/snack.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { ROOM } from '../shared/models/room';
import { THREAD } from '../shared/models/thread';
import { MESSAGE } from '../shared/models/message';
import { SNACK } from '../shared/models/snack';

@Injectable()
export class RoomContentService implements OnDestroy {
  private ngUnsubscribe: Subject<any>;

  public room: ROOM;
  public thread: THREAD;
  public guests: { user: string, privilege: string, status: gStatus }[];

  public threadEmitter: Subject<number>;
  public roomEmitter: Subject<string>;
  public streamEmitter: Subject<{ message: MESSAGE, new: boolean } | number | null>;
  public queryResultsEmitter: Subject<{ user: string }[]>;

  get isSuperGuest(): boolean {
    const index = this.room.guests.findIndex(guest => guest.user === this._authService.user.userIdentity);
    if (index !== -1) {
      return this.room.guests[index].privilege !== 'basic';
    }
  }

  constructor(
    private _socketService: SocketService,
    private _authService: AuthService,
    private _snackService: SnackService
  ) {
    this.ngUnsubscribe = new Subject();
    this.threadEmitter = new Subject();
    this.streamEmitter = new Subject();
    this.roomEmitter = new Subject();
    this.queryResultsEmitter = new Subject();
    this.init();
  }

  private init() {
    this.room = null;
    this.thread = null;
    this.guests = [];
    this.listenSocket();
  }

  listenSocket() {
    this._socketService.roomcontent_stream
      .takeUntil(this.ngUnsubscribe)
      .subscribe((res: { event: string, data: any }) => {
        switch (res.event) {
          case 'connection-guest':
            if (this.room !== null && this.room.id === res.data.room_id) {
              const i = this.guests.findIndex(guest => guest.user === res.data.user);
              if (i !== -1) {
                this.guests[i].status = res.data.online ? gStatus.online : gStatus.offline;;
              }
            }
            break;
          case 'get-room-ack':
            this.room = res.data.room;
            this.thread = null;
            this.guests = [];
            res.data.room.guests.map(guest => {
              this.guests.push({
                user: guest.user,
                privilege: guest.privilege,
                status: gStatus.offline
              });
            });
            this.roomEmitter.next(null);
            break;
          case 'get-guests-ack':
            res.data.guests.map(guest => {
              const i = this.guests.findIndex(thisGuest => thisGuest.user === guest.user);
              if (i !== -1) {
                this.guests[i].status = guest.status ? gStatus.online : gStatus.offline;
              }
            });
            break;
          case 'rename-room-ack':
            if (this.room !== null && this.room.id === res.data.room_id) {
              this.room.name = res.data.room_name;
              this._snackService.generateSnack({ message: 'Room successfully renamed', action: 'Close', duration: 2000 });
            }
            break;
          case 'create-thread-ack':
            this._snackService.generateSnack({ message: 'Thread successfully created', action: 'Close', duration: 2000 });
            break;
          case 'get-thread-ack':
            if (this.room.id === res.data.thread.room) {
              this.thread = res.data.thread;
              this.streamEmitter.next(null);
              this.threadEmitter.next(0);
            }
            break;
          case 'get-stream-ack':
            if (this.thread !== null) {
              if (res.data.stream.length === 0) {
                this.threadEmitter.next(2);
                this.streamEmitter.next(0);
              } else {
                res.data.stream.map(message => {
                  this.streamEmitter.next({ message: message, new: false });
                });
                this.threadEmitter.next(1);
              }
            }
            break;
          case 'thread-renamed':
            if (this.room !== null && this.room.id === res.data.room_id) {
              const indexT = this.room.threads.findIndex(thread => thread._id === res.data.thread_id);
              if (indexT === -1) {
                this.room.mainthread.title = res.data.thread_name
              } else {
                this.room.threads[indexT].title = res.data.thread_name;
              }
              if (this.thread !== null && this.thread._id === res.data.thread_id) {
                this.thread.title = res.data.thread_name;
              }
              this._snackService.generateSnack({ message: 'Thread successfully renamed', action: 'Close', duration: 2000 });
            }
            break;
          case 'deleted-thread':
            if (this.room !== null && this.room.id === res.data.room_id) {
              const indexT = this.room.threads.findIndex(thread => thread._id === res.data.thread_id);
              if (indexT !== -1) {
                this.room.threads.splice(indexT, 1);
              }
              if (this.thread._id === res.data.thread_id) {
                this.thread = null;
              }
              this._snackService.generateSnack({ message: 'Thread successfully deleted', action: 'Close', duration: 2000 });
            }
            break;
          case 'new-thread':
            if (this.room !== null && this.room.id === res.data.room_id) {
              this.room.threads.push({ _id: res.data._id, title: res.data.title });
            }
            this.roomEmitter.next(res.data._id);
            break;
          case 'send-thread-ack':
            break;
          case 'new-message':
            if (this.room !== null && this.room.id === res.data.room_id && this.thread._id === res.data.thread_id) {
              this.streamEmitter.next({ message: res.data.message, new: true });
            }
            break;
          case 'search-user-ack':
            this.queryResultsEmitter.next(res.data.users);
            break;
          case 'new-guest':
            if (this.room !== null && this.room.id === res.data.room_id) {
              this.guests.push({ user: res.data.guest.user, privilege: res.data.guest.privilege, status: gStatus.offline });
              // get new guest connection status
            }
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
          case 'reset-data':
            this.ngUnsubscribe.next();
            this.ngUnsubscribe.complete();
            this.init();
            break;
        }
      });
  }

  ngOnDestroy() {
    console.log('HEAD OF THE DESTROYER OF WORLDS');
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