import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from './auth.service'
import { environment } from "../../environments/environment";
import * as res from '../models/socket-res'
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

  private socket;

  private ngUnsubscribe: Subject<any> = new Subject();
  private connected: BehaviorSubject<boolean>;

  public sidelist_stream: Observable<any>;
  private sidelistSubject: Subject<any>;

  public roomcontent_stream: Observable<any>;
  private roomcontentSubject: Subject<any>;

  public toolbar_stream: Observable<any>;
  private toolbarSubject: Subject<any>;

  constructor(
    private _authService: AuthService
  ) {
    this.connected = new BehaviorSubject(false);

    this.sidelistSubject = new Subject();
    this.sidelist_stream = this.sidelistSubject.asObservable();
    this.roomcontentSubject = new Subject();
    this.roomcontent_stream = this.roomcontentSubject.asObservable();
    this.toolbarSubject = new Subject();
    this.toolbar_stream = this.toolbarSubject.asObservable();
  }

  public login() {
    this.connection();
  }
  public logout() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.socket.disconnect();
    this.socket = null;
    this.connected.next(false);
  }

  private init() {
    this.afterAuth();
    this.createRoom();
    this.getRoom();
    this.renameRoom();
    this.createThread();
    this.getThread();
    this.sendThread();
    this.sendFriendRequest();
    this.replyFriendRequest();
    this.blockUser();
    this.addGuest();
    this.joinRoom();
    this.leaveRoom();
    this.removeGuest();
  }

  private listen(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(event, data => {
        console.log('incoming for', event, data);
        observer.next({ event: event, data: data });
      });
      return () => {
        this.socket.off(event);
      }
    });
  }

  private connection() {
    this.socket = io(environment.socket.baseUrl);

    this.listen('connect').takeUntil(this.ngUnsubscribe).subscribe(
      res => {
        this.socket.emit('authenticate', { token: this._authService.token });
      }
    );
    this.listen('authenticated').takeUntil(this.ngUnsubscribe).subscribe(
      res => {
        this.connected.next(true);
        this.init();
      }
    );
    this.listen('unauthorized').takeUntil(this.ngUnsubscribe).subscribe(
      res => {
        console.log(res);
      }
    );
    this.listen('disconnect').takeUntil(this.ngUnsubscribe).subscribe(
      res => {
        this.connected.next(false);
      }
    );
    this.listen('error-manager').takeUntil(this.ngUnsubscribe).subscribe(
      res => {
        console.log(res);
      }
    );
  }

  private afterAuth() {
    this.listen('connected-friends').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.CONNECTED_FRIENDS }) => {
        this.sidelistSubject.next(res);
      }
    );

    this.listen('joined-rooms').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.JOINED_ROOMS }) => {
        this.sidelistSubject.next(res);
      }
    );

    this.listen('connection-friend').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.CONNECTION_FRIEND }) => {
        this.sidelistSubject.next(res);
        this.toolbarSubject.next(res);
      }
    );

    this.listen('connection-guest').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.CONNECTION_GUEST }) => {
        this.roomcontentSubject.next(res);
      }
    );
  }

  private createRoom() {
    this.listen('create-room-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.NEW_ROOM }) => {
        this.sidelistSubject.next(res);
      }
    );
  }
  public createRoomAction(name: string, guests?: string[]) {
    if (guests) {
      this.socket.emit('create-room', { name: name, guests: guests });
    } else {
      this.socket.emit('create-room', { name: name });
    }
  }
  private renameRoom() {
    this.listen('rename-room-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.RENAME_ROOM }) => {
        this.sidelistSubject.next(res);
        this.toolbarSubject.next(res);
      }
    );
  }
  public renameRoomAction(room_id: string, new_name: string) {
    this.socket.emit('rename-room', { room_id: room_id, new_name: new_name });
  }
  private getRoom() {
    this.listen('get-room-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.GET_ROOM }) => {
        this.sidelistSubject.next(res);
        this.roomcontentSubject.next(res);
        this.toolbarSubject.next(res);
      }
    );
  }
  public getRoomAction(room_id: string) {
    this.socket.emit('get-room', { room_id: room_id });
  }

  private createThread() {
    this.listen('create-thread-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.SUCCESS }) => {
        this.roomcontentSubject.next(res);
      }
    );
    this.listen('new-thread').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.NEW_THREAD }) => {
        this.roomcontentSubject.next(res);
      }
    );
  }
  public createThreadAction(title: string, room_id: string) {
    this.socket.emit('create-thread', { title: title, room_id: room_id });
  }
  private getThread() {
    this.listen('get-thread-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.GET_THREAD }) => {
        this.roomcontentSubject.next(res);
        this.toolbarSubject.next(res);
      }
    );
  }
  public getThreadAction(room_id: string, thread_id: string) {
    this.socket.emit('get-thread', { room_id: room_id, thread_id: thread_id });
  }

  private sendThread() {
    this.listen('send-thread-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.SUCCESS }) => {
        this.roomcontentSubject.next(res);
      }
    );
    this.listen('new-message').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.NEW_MESSAGE }) => {
        this.roomcontentSubject.next(res);
      }
    );
  }
  public sendThreadAction(content: string, room_id: string, thread_id: string, media: string) {
    this.socket.emit('send-thread', {
      content: content,
      room_id: room_id,
      thread_id: thread_id,
      media: media
    });
  }

  private sendFriendRequest() {
    this.listen('send-friend-request-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.SEND_FRIEND_REQUEST }) => {
        this.sidelistSubject.next(res);
        this.toolbarSubject.next(res);
      }
    );
    this.listen('friend-request').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.FRIEND_REQUEST }) => {
        this.sidelistSubject.next(res);
        this.toolbarSubject.next(res);
      }
    );
  }

  private replyFriendRequest() {
    this.listen('reply-friend-request-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.REPLY_FRIEND_REQUEST }) => {
        this.sidelistSubject.next(res);
        this.toolbarSubject.next(res);
      }
    );
    this.listen('response-friend-request').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.RESPONSE_FRIEND_REQUEST }) => {
        this.sidelistSubject.next(res);
        this.toolbarSubject.next(res);
      }
    );
  }

  private blockUser() {
    this.listen('block-user-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.BLOCK_USER }) => {
        this.sidelistSubject.next(res);
        this.toolbarSubject.next(res);
      }
    );
    this.listen('remove-friend').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.REMOVE_FRIEND }) => {
        this.sidelistSubject.next(res);
        this.toolbarSubject.next(res);
      }
    );
  }

  private addGuest() {
    this.listen('add-guest-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.SUCCESS }) => {
        this.toolbarSubject.next(res);
      }
    );
    this.listen('new-guest').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.ADD_GUEST }) => {
        this.roomcontentSubject.next(res);
      }
    );
    this.listen('added-room').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.ADDED_ROOM }) => {
        this.toolbarSubject.next(res);
        this.sidelistSubject.next(res);
      }
    );
  }
  public addGuestAction(room_id: string, guest: string) {
    this.socket.emit('add-guest', { room_id: room_id, add_user: guest });
  }

  private joinRoom() {
    this.listen('join-room-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.JOIN_ROOM }) => {
        this.sidelistSubject.next(res);
      }
    );
  }
  public joinRoomAction(room_id: string) {
    this.socket.emit('join-room', { room_id: room_id });
  }
  private leaveRoom() {
    this.listen('leave-room-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.LEAVE_ROOM }) => {
        this.sidelistSubject.next(res);
      }
    );
  }
  public leaveRoomAction(room_id: string) {
    this.socket.emit('leave-room', { room_id: room_id });
  }
  public mainMenu() {
    this.roomcontentSubject.next({ event: 'main-menu', data: null });
    this.sidelistSubject.next({ event: 'main-menu', data: null });
    this.toolbarSubject.next({ event: 'main-menu', data: null });
  }

  private removeGuest() {
    this.listen('remove-guest-ack').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.SUCCESS }) => {
        this.toolbarSubject.next(res);
        this.roomcontentSubject.next(res);
      }
    );
    this.listen('left-guest').takeUntil(this.ngUnsubscribe).subscribe(
      (res: { event: string, data: res.LEFT_GUEST }) => {
        this.toolbarSubject.next(res);
        this.roomcontentSubject.next(res);
      }
    );
  }

}
