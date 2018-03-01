import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  private room: { id: string, name: string, owner: string };
  private thread: { id: string, title: string };

  constructor(
    private socketService: SocketService
  ) {
    this.room = { id: null, name: null, owner: null };
    this.thread = { id: null, title: null };
  }

  ngOnInit() {
    this.socketService.toolbar_stream
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
