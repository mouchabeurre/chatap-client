import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { THREAD } from '../../models/thread';

@Component({
  selector: 'app-threadlist',
  templateUrl: './threadlist.component.html',
  styleUrls: ['./threadlist.component.css']
})
export class ThreadlistComponent implements OnInit {
  private _threads: { _id: string, title: string }[];

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
    });;
  }

  @Input() mainThread: { _id: string, title: string };
  @Input() currentThread: string | null;
  @Output() onChangeThread = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    console.log(this._threads);
    console.log(this.mainThread);
    console.log(this.currentThread);
  }

  change(id: string) {
    if (this.currentThread !== id) {
      this.onChangeThread.emit(id);
    }
  }

}
