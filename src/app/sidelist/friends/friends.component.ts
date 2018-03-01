import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FriendfilterPipe } from '../pipes/friendfilter.pipe';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FriendsComponent implements OnInit {

  @Input() friends: Friend[];
  @Input() query: string;
  @Output() onChangeFriend = new EventEmitter<string>();

  constructor(
  ) { }

  ngOnInit() {
  }

  change(username: string) {
    this.onChangeFriend.emit(username);
  }

}

interface Friend {
  username: string;
  online: boolean;
}
