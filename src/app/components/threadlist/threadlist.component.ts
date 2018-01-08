import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ThreadManagerComponent } from '../thread-manager/thread-manager.component';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { THREAD } from '../../models/thread';

@Component({
  selector: 'app-threadlist',
  templateUrl: './threadlist.component.html',
  styleUrls: ['./threadlist.component.css']
})
export class ThreadlistComponent implements OnInit {
  private _threads: { _id: string, title: string }[];

  @Input() isSuperGuest: boolean;
  @Input() roomId: string;

  @Input()
  set threads(threads: { _id: string, title: string }[]) {
    this._threads = threads;
  }
  get threads(): { _id: string, title: string }[] {
    return this._threads.sort((a, b) => {
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

  @Input() mainThread: { _id: string, title: string };
  @Input() currentThread: string | null;
  @Output() onChangeThread = new EventEmitter<string>();

  constructor(
    public dialog: MatDialog,
    private socketService: SocketService,
    private _authService: AuthService
  ) { }

  ngOnInit() { }

  change(id: string) {
    if (this.currentThread !== id) {
      this.onChangeThread.emit(id);
    }
  }

  openThreadNameEditor() {
    let title;
    const indexT = this._threads.findIndex(thread => thread._id === this.currentThread);
    if (indexT < 0) {
      title = this.mainThread.title;
    } else {
      title = this._threads[indexT].title
    }
    let dialogRef = this.dialog.open(ThreadManagerComponent, {
      width: '350px',
      data: {
        action: 'rename',
        title: 'Edit thread name',
        thread_id: this.currentThread,
        thread_name: title
      }
    });

    dialogRef.afterClosed().subscribe((res: { thread_name: string, thread_id: string }) => {
      let title;
      const indexT = this._threads.findIndex(thread => thread._id === this.currentThread);
      if (indexT < 0) {
        title = this.mainThread.title;
      } else {
        title = this._threads[indexT].title
      }
      if (res && res.thread_name && res.thread_name !== title) {
        this.socketService.renameThreadAction(this.roomId, res.thread_id, res.thread_name);
      }
    });
  }

  openConfirmDelete() {
    const indexT = this._threads.findIndex(thread => thread._id === this.currentThread);
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        description: `You are about to delete thread ${this.threads[indexT].title} (ID: ${this.currentThread}). The thread will be permanently removed from the room.`,
        confirm_statement: 'Please confirm the deletion.'
      }
    });

    dialogRef.afterClosed().subscribe((res: { confirmed: boolean }) => {
      if (res && res.confirmed) {
        this.socketService.deleteThreadAction(this.roomId, this.currentThread);
      }
    });
  }

}
