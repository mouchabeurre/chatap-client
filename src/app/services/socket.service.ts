import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from './auth.service'
import { environment } from "../../environments/environment";
import * as res from '../models/socket-res'
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

  private socket;

  private connected: BehaviorSubject<boolean>;

  public sidelist_stream: Observable<any>;
  private sidelistSubject: Subject<any>;

  public roomcontent_stream: Observable<any>;
  private roomcontentSubject: Subject<any>;

  public notification_stream: Observable<any>;
  private notificationSubject: Subject<any>;

  constructor(
    private _authService: AuthService
  ) {
    this.connected = new BehaviorSubject(false);

    this.sidelistSubject = new Subject();
    this.sidelist_stream = this.sidelistSubject.asObservable();
    this.roomcontentSubject = new Subject();
    this.roomcontent_stream = this.roomcontentSubject.asObservable();
    this.notificationSubject = new Subject();
    this.notification_stream = this.notificationSubject.asObservable();

    this.init();
  }

  private init() {
    this.connection();
    this.afterAuth();
    this.createRoom();
    this.getRoom();
    this.createThread();
    this.getThread();
    this.sendThread();
    this.sendFriendRequest();
    this.replyFriendRequest();
    this.blockUser();
    this.addGuest();
    this.joinRoom();
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

    this.listen('connect').subscribe(
      res => {
        this.socket.emit('authenticate', { token: this._authService.token });
      }
    );
    this.listen('authenticated').subscribe(
      res => {
        this.connected.next(true);
      }
    );
    this.listen('unauthorized').subscribe(
      res => {
        console.log(res);
      }
    );
    this.listen('disconnect').subscribe(
      res => {
        this.connected.next(false);
      }
    );
    this.listen('error-manager').subscribe(
      res => {
        console.log(res);
      }
    );
  }

  private afterAuth() {
    this.listen('connected-friends').subscribe(
      (res: { event: string, data: res.CONNECTED_FRIENDS }) => {
        this.sidelistSubject.next(res);
      }
    );

    this.listen('joined-rooms').subscribe(
      (res: { event: string, data: res.JOINED_ROOMS }) => {
        this.sidelistSubject.next(res);
      }
    );

    this.listen('connection-friend').subscribe(
      (res: { event: string, data: res.CONNECTION_FRIEND }) => {
        this.sidelistSubject.next(res);
        this.notificationSubject.next(res);
      }
    );

    this.listen('connection-guest').subscribe(
      (res: { event: string, data: res.CONNECTION_GUEST }) => {
        this.roomcontentSubject.next(res);
      }
    );
  }

  private createRoom() {
    this.listen('create-room-ack').subscribe(
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
  private getRoom() {
    this.listen('get-room-ack').subscribe(
      (res: { event: string, data: res.GET_ROOM }) => {
        this.sidelistSubject.next(res);
        this.roomcontentSubject.next(res);
      }
    );
  }
  public getRoomAction(room_id: string) {
    this.socket.emit('get-room', { room_id: room_id });
  }

  private createThread() {
    this.listen('create-thread-ack').subscribe(
      (res: { event: string, data: res.SUCCESS }) => {
        this.roomcontentSubject.next(res);
      }
    );
    this.listen('new-thread').subscribe(
      (res: { event: string, data: res.NEW_THREAD }) => {
        this.roomcontentSubject.next(res);
      }
    );
  }
  public createThreadAction(title: string, room_id: string) {
    this.socket.emit('create-thread', { title: title, room_id: room_id });
  }
  private getThread() {
    this.listen('get-thread-ack').subscribe(
      (res: { event: string, data: res.GET_THREAD }) => {
        this.roomcontentSubject.next(res);
      }
    );
  }
  public getThreadAction(room_id: string, thread_id: string) {
    this.socket.emit('get-thread', { room_id: room_id, thread_id: thread_id });
  }

  private sendThread() {
    this.listen('send-thread-ack').subscribe(
      (res: { event: string, data: res.SUCCESS }) => {
        this.roomcontentSubject.next(res);
      }
    );
    this.listen('new-message').subscribe(
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
    this.listen('send-friend-request-ack').subscribe(
      (res: { event: string, data: res.SEND_FRIEND_REQUEST }) => {
        this.sidelistSubject.next(res);
        this.notificationSubject.next(res);
      }
    );
    this.listen('friend-request').subscribe(
      (res: { event: string, data: res.FRIEND_REQUEST }) => {
        this.sidelistSubject.next(res);
        this.notificationSubject.next(res);
      }
    );
  }

  private replyFriendRequest() {
    this.listen('reply-friend-request-ack').subscribe(
      (res: { event: string, data: res.REPLY_FRIEND_REQUEST }) => {
        this.sidelistSubject.next(res);
        this.notificationSubject.next(res);
      }
    );
    this.listen('response-friend-request').subscribe(
      (res: { event: string, data: res.RESPONSE_FRIEND_REQUEST }) => {
        this.sidelistSubject.next(res);
        this.notificationSubject.next(res);
      }
    );
  }

  private blockUser() {
    this.listen('block-user-ack').subscribe(
      (res: { event: string, data: res.BLOCK_USER }) => {
        this.sidelistSubject.next(res);
        this.notificationSubject.next(res);
      }
    );
    this.listen('remove-friend').subscribe(
      (res: { event: string, data: res.REMOVE_FRIEND }) => {
        this.sidelistSubject.next(res);
        this.notificationSubject.next(res);
      }
    );
  }

  private addGuest() {
    this.listen('add-guest-ack').subscribe(
      (res: { event: string, data: res.SUCCESS }) => {
        this.notificationSubject.next(res);
      }
    );
    this.listen('new-guest').subscribe(
      (res: { event: string, data: res.ADD_GUEST }) => {
        this.roomcontentSubject.next(res);
      }
    );
    this.listen('added-room').subscribe(
      (res: { event: string, data: res.ADDED_ROOM }) => {
        this.notificationSubject.next(res);
        this.sidelistSubject.next(res);
      }
    );
  }
  public addGuestAction(room_id: string, guest: string) {
    this.socket.emit('add-guest', { room_id: room_id, add_user: guest });
  }

  private joinRoom() {
    this.listen('join-room-ack').subscribe(
      (res: { event: string, data: res.JOIN_ROOM }) => {
        this.notificationSubject.next(res);
        this.roomcontentSubject.next(res);
      }
    );
  }
  public joinRoomAction(room_id: string) {
    this.socket.emit('join-room', { room_id: room_id });
  }

  private removeGuest() {
    this.listen('remove-guest-ack').subscribe(
      (res: { event: string, data: res.SUCCESS }) => {
        this.notificationSubject.next(res);
        this.roomcontentSubject.next(res);
      }
    );
    this.listen('left-guest').subscribe(
      (res: { event: string, data: res.LEFT_GUEST }) => {
        this.notificationSubject.next(res);
        this.roomcontentSubject.next(res);
      }
    );
  }

}
