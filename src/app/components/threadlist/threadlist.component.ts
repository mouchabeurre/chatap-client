import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ThreadManagerComponent } from '../thread-manager/thread-manager.component';
import { SocketService } from '../../services/socket.service';
import { RoomContentService } from '../../services/room-content.service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { THREAD } from '../../models/thread';

@Component({
  selector: 'app-threadlist',
  templateUrl: './threadlist.component.html',
  styleUrls: ['./threadlist.component.css']
})
export class ThreadlistComponent implements OnInit {
  private ngUnsubscribe: Subject<any>;

  private tmpThread: string;
  private lastRoom: string;

  get isSuperGuest(): boolean {
    return this._rcService.isSuperGuest;
  }

  get roomId(): string | null {
    if (this._rcService.room) {
      return this._rcService.room.id;
    }
    return null;
  }

  get threads(): { _id: string, title: string }[] | null {
    if (this._rcService.room) {
      return this._rcService.room.threads.sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();
        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }
        return 0;
      });
    }
    return null;
  }

  get mainThread(): { _id: string, title: string } {
    if (this._rcService.room) {
      return this._rcService.room.mainthread;
    }
    return null;
  }
  get cThread(): string | null {
    if (this._rcService.thread) {
      return this._rcService.thread._id;
    }
    return null;
  }

  constructor(
    public dialog: MatDialog,
    private _rcService: RoomContentService,
    private _socketService: SocketService
  ) {
    this.ngUnsubscribe = new Subject();
  }

  ngOnInit() {
    this._rcService.roomEmitter
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: string | null) => {
        if (data) {
          this.onChangeThread(data);
        }
        this.tmpThread = null;
      });
  }

  onChangeThread(id: string) {
    if (this.cThread !== id && this.tmpThread !== id) {
      this._rcService.threadEmitter.next(2);
      this._socketService.getThreadAction(this._rcService.room.id, id);
      this._socketService.getStreamAction(this._rcService.room.id, id);
      this.tmpThread = id;
    }
  }

  openThreadNameEditor() {
    let title;
    const indexT = this.threads.findIndex(thread => thread._id === this.cThread);
    if (indexT < 0) {
      title = this.mainThread.title;
    } else {
      title = this.threads[indexT].title
    }
    let dialogRef = this.dialog.open(ThreadManagerComponent, {
      width: '350px',
      data: {
        action: 'rename',
        title: 'Edit thread name',
        thread_id: this.cThread,
        thread_name: title
      }
    });

    dialogRef.afterClosed().subscribe((res: { thread_name: string, thread_id: string }) => {
      let title;
      const indexT = this.threads.findIndex(thread => thread._id === this.cThread);
      if (indexT < 0) {
        title = this.mainThread.title;
      } else {
        title = this.threads[indexT].title
      }
      if (res && res.thread_name && res.thread_name !== title) {
        this._socketService.renameThreadAction(this.roomId, res.thread_id, res.thread_name);
      }
    });
  }

  openConfirmDelete() {
    const indexT = this.threads.findIndex(thread => thread._id === this.cThread);
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        description: `You are about to delete thread ${this.threads[indexT].title} (ID: ${this.cThread}). The thread will be permanently removed from the room.`,
        confirm_statement: 'Please confirm the deletion.'
      }
    });

    dialogRef.afterClosed().subscribe((res: { confirmed: boolean }) => {
      if (res && res.confirmed) {
        this._socketService.deleteThreadAction(this.roomId, this.cThread);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
