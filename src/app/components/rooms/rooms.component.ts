import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { RoomfilterPipe } from '../../pipes/roomfilter.pipe';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RoomsComponent implements OnInit {
  private tmpCurrent: string;

  @Input() rooms: Room[];
  @Input() query: string;
  @Input() currentRoom: string | null;
  @Output() onChangeRoom = new EventEmitter<string>();

  constructor(
  ) { }

  ngOnInit() {
  }

  change(id: string) {
    if (this.currentRoom !== id && this.tmpCurrent !== id) {
      this.tmpCurrent = id;
      this.onChangeRoom.emit(id);
    }
  }

}

interface Room {
  name: string;
  id: string;
  date: Date;
}