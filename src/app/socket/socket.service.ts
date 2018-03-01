import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../shared/auth.service'
import { environment } from "../../environments/environment";
import * as res from '../shared/models/socket-res'
import * as io from 'socket.io-client';
import { routes, Subjects } from './api';

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
    this.roomcontentSubject.next({ event: 'reset-data', data: null });
    this.sidelistSubject.next({ event: 'reset-data', data: null });
    this.toolbarSubject.next({ event: 'reset-data', data: null });
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.socket.disconnect();
    this.socket = null;
    this.connected.next(false);
  }

  private init() {
    this.listenRoutes();
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

  private listenRoutes() {
    routes.map(route => {
      this.listen(route.action).takeUntil(this.ngUnsubscribe).subscribe(res => {
        route.to.map(subject => {
          switch (subject) {
            case Subjects.roomcontent:
              this.roomcontentSubject.next(res);
              break;
            case Subjects.sidelist:
              this.sidelistSubject.next(res);
              break;
            case Subjects.toolbar:
              this.toolbarSubject.next(res);
          }
        });
      });
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

  public createRoomAction(name: string, guests?: string[]) {
    if (guests) {
      this.socket.emit('create-room', { name: name, guests: guests });
    } else {
      this.socket.emit('create-room', { name: name });
    }
  }

  public renameRoomAction(room_id: string, new_name: string) {
    this.socket.emit('rename-room', { room_id: room_id, new_name: new_name });
  }

  public getRoomAction(room_id: string) {
    this.socket.emit('get-room', { room_id: room_id });
  }


  public createThreadAction(title: string, room_id: string) {
    this.socket.emit('create-thread', { title: title, room_id: room_id });
  }

  public renameThreadAction(room_id: string, thread_id: string, new_name: string) {
    this.socket.emit('rename-thread', { room_id: room_id, thread_id: thread_id, new_name: new_name });
  }

  public deleteThreadAction(room_id: string, thread_id: string) {
    this.socket.emit('delete-thread', { room_id: room_id, thread_id: thread_id });
  }

  public getThreadAction(room_id: string, thread_id: string) {
    this.socket.emit('get-thread', { room_id: room_id, thread_id: thread_id });
  }

  public getStreamAction(room_id: string, thread_id: string, offset: number = 0) {
    this.socket.emit('get-stream', { room_id: room_id, thread_id: thread_id, offset: offset });
  }


  public sendThreadAction(content: string, room_id: string, thread_id: string, media: string) {
    this.socket.emit('send-thread', {
      content: content,
      room_id: room_id,
      thread_id: thread_id,
      media: media
    });
  }


  public queryGuestsAction(room_id: string, query: string) {
    this.socket.emit('search-user', { room_id: room_id, query: query });
  }
  public addGuestAction(room_id: string, guest: string) {
    this.socket.emit('add-guest', { room_id: room_id, add_user: guest });
  }


  public joinRoomAction(room_id: string) {
    this.socket.emit('join-room', { room_id: room_id });
  }

  public leaveRoomAction(room_id: string) {
    this.socket.emit('leave-room', { room_id: room_id });
  }
  public mainMenu() {
    this.roomcontentSubject.next({ event: 'main-menu', data: null });
    this.sidelistSubject.next({ event: 'main-menu', data: null });
    this.toolbarSubject.next({ event: 'main-menu', data: null });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
