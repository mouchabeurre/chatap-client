import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { RoomfilterPipe } from '../../pipes/roomfilter.pipe';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RoomsComponent implements OnInit {

  @Input() rooms: Room[];
  @Input() query: string;
  @Output() onChangeRoom = new EventEmitter<string>();

  constructor(
  ) { }

  ngOnInit() {
  }

  change(id: string) {
    this.onChangeRoom.emit(id);
  }

}

interface Room {
  name: string;
  id: string;
}