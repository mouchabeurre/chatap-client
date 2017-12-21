import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ThreadCreationComponent } from '../thread-creation/thread-creation.component';
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

  constructor(
    public dialog: MatDialog,
    private socketService: SocketService
  ) {
    this.room = null;
    this.thread = null;
  }

  ngOnInit() {
    this.socketService.roomcontent_stream.subscribe(
      (res: { event: string, data: any }) => {
        switch (res.event) {
          case 'connection-guest':
            break;
          case 'get-room-ack':
            this.room = res.data.room;
            this.thread = null;
            break;
          case 'create-thread-ack':
            break;
          case 'get-thread-ack':
            this.thread = res.data.thread;
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
            this.room = this.thread = null;
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

}
