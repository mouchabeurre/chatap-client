import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes, group } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoomContentService } from '../../services/room-content.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { StreamDatePipe } from '../../pipes/stream-date.pipe';
import { MESSAGE } from '../../models/message';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    trigger('whoa', [
      state('in',
        style({ transform: 'scaleX(1) scaleY(1)', opacity: 1 })
      ),
      transition(':enter', [
        animate(400, keyframes([
          style({ transform: 'scaleX(0.7) scaleY(0.2)', opacity: 0, offset: 0 }),
          style({ transform: 'scaleX(1.01) scaleY(1)', opacity: 1, offset: 0.4 }),
          style({ transform: 'scaleX(1) scaleY(1)', opacity: 1, offset: 1 })
        ]))
      ])
    ])
  ]
})
export class ChatComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any>;

  private fg: FormGroup;
  private new_message: FormControl;
  private stream: MESSAGE[];

  get is_valid_message(): boolean {
    return this.new_message.errors && (this.new_message.dirty || this.new_message.touched);
  }

  get whoami(): string {
    return this._authService.user.userIdentity;
  }

  constructor(
    private _authService: AuthService,
    private _rcService: RoomContentService,
    private _fb: FormBuilder,
    private _socketService: SocketService
  ) {
    this.ngUnsubscribe = new Subject();
    this.stream = [];
  }

  ngOnInit() {
    this._rcService.streamEmitter
      .takeUntil(this.ngUnsubscribe)
      .subscribe((res: { message: MESSAGE, new: boolean } | null) => {
        if (res === null) {
          this.stream = [];
        } else {
          if (res.new) {
            this.stream.push(res.message);
          } else {
            this.stream.unshift(res.message);
          }
        }
      });

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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
