import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { THREAD } from '../../models/thread';

@Component({
  selector: 'app-threadlist',
  templateUrl: './threadlist.component.html',
  styleUrls: ['./threadlist.component.css']
})
export class ThreadlistComponent implements OnInit {

  @Input() threads: { id: string, title: string }[];
  @Input() currentThread: string | null;
  @Output() onChangeThread = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  canChange(id: string): boolean {
    if (this.currentThread === null) {
      return true;
    }
    return (this.currentThread === id) ? false : true;
  }

  change(id: string) {
    if (this.currentThread !== id) {
      this.onChangeThread.emit(id);
    }
  }

}
