import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoomContentService } from '../../services/room-content.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { StreamDatePipe } from '../../pipes/stream-date.pipe';
import { MESSAGE } from '../../models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private fg: FormGroup;
  private new_message: FormControl;

  get is_valid_message(): boolean {
    return this.new_message.errors && (this.new_message.dirty || this.new_message.touched);
  }

  get stream(): MESSAGE[] | null {
    if (this._rcService.thread.feed) {
      return this._rcService.thread.feed;
    }
    return null;
  }

  get whoami(): string {
    return this._authService.user.userIdentity;
  }

  constructor(
    private _authService: AuthService,
    private _rcService: RoomContentService,
    private _fb: FormBuilder,
    private _socketService: SocketService
  ) { }

  ngOnInit() {
    this.new_message = new FormControl(null, {
      validators: [Validators.required, Validators.maxLength(500)]
    });
    this.fg = this._fb.group({
      new_message: this.new_message
    });
  }

  preventNewline(e) {
    e.preventDefault();
    this.onSubmit();
  }

  onSubmit() {
    if (this.fg.controls.new_message.value) {
      const loadout = {
        content: this.fg.controls.new_message.value,
        media: 'text'
      }
      this._socketService.sendThreadAction(loadout.content, this._rcService.room.id, this._rcService.thread._id, loadout.media);
    }
    this.fg.reset();
  }

  onLoadMore(offset: number) {
    this._socketService.getStreamAction(this._rcService.room.id, this._rcService.thread._id, offset);
  }

}
