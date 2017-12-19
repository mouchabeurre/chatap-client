import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { ROOM } from '../../models/room';
import { THREAD } from '../../models/thread';

@Component({
  selector: 'app-roomcontent',
  templateUrl: './roomcontent.component.html',
  styleUrls: ['./roomcontent.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RoomcontentComponent implements OnInit {

  private room: ROOM;
  private thread: THREAD;
  private _thread_list: { id: string, title: string }[];

  get threads_list(): { id: string, title: string }[] | null {
    if (!this.room) {
      return null;
    }
    return this._thread_list;
  }

  get thread_id(): string | null {
    if (!this.thread) {
      return null;
    }
    return this.thread._id;
  }

  constructor(
    private socketService: SocketService
  ) {
    this.room = null;
    this.thread = null;
    this._thread_list = [];
  }

  ngOnInit() {
    this.socketService.roomcontent_stream.subscribe(
      (res: { event: string, data: any }) => {
        switch (res.event) {
          case 'connection-guest':
            break;
          case 'get-room-ack':
            this.room = res.data.room;
            this._thread_list = [];
            this._thread_list.push({ id: this.room.mainthread._id, title: this.room.mainthread.title });
            for (let i = 0; i < this.room.threads.length; i++) {
              this._thread_list.push({ id: this.room.threads[i]._id, title: this.room.threads[i].title });
            }
            this.thread = null;
            break;
          case 'create-thread-ack':
            break;
          case 'get-thread-ack':
            this.thread = res.data.thread;
            break;
          case 'new-thread':
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

}
