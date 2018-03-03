import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes, group } from '@angular/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RoomContentService } from '../../../room/room-content.service';
import { SocketService } from '../../../socket/socket.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-guests-add',
  templateUrl: './guests-add.component.html',
  styleUrls: ['./guests-add.component.css'],
  animations: [
    trigger('whoa2', [
      state('in', style({ transform: 'scaleX(1) scaleY(1)' })),
      transition(':enter', [
        animate(400, keyframes([
          style({ transform: 'scaleX(0.7) scaleY(0.2)', opacity: 0, offset: 0 }),
          style({ transform: 'scaleX(1.01) scaleY(1)', opacity: 1, offset: 0.4 }),
          style({ transform: 'scaleX(1) scaleY(1)', opacity: 1, offset: 1 })
        ]))
      ]),
      transition(':leave', [
        animate(400, keyframes([
          style({ transform: 'scaleX(1) scaleY(1)', opacity: 1, offset: 0 }),
          style({ transform: 'scaleX(1.01) scaleY(1)', opacity: 1, offset: 0.4 }),
          style({ transform: 'scaleX(0.7) scaleY(0.2)', opacity: 0, offset: 1 })
        ]))
      ])
    ])
  ]
})
export class GuestsAddComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any>;

  public query: FormControl;
  public fg_query: FormGroup;
  public response: { list: string[], pending: boolean };
  public selected: string[];

  get guests(): { user: string, privilege: string, status: gStatus }[] | null {
    return !this._rcService.room ? null : this._rcService.guests;
  }
  constructor(
    public dialogRef: MatDialogRef<GuestsAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _rcService: RoomContentService,
    private _socketService: SocketService
  ) {
    this.ngUnsubscribe = new Subject();
    this.selected = [];
  }

  ngOnInit() {
    this.response = { list: [], pending: false };

    this.query = new FormControl(null);
    this.fg_query = this._fb.group({
      query: this.query
    });

    this.query.valueChanges
      .debounceTime(400)
      .filter(value => {
        this.response.list = [];
        return (value && value.length >= 2);
      })
      .subscribe(term => {
        this.response.pending = true;
        this._socketService.queryGuestsAction(this._rcService.room.id, term);
      });

    this._rcService.queryResultsEmitter
      .takeUntil(this.ngUnsubscribe)
      .subscribe((res: { user: string }[]) => {
        this.response.pending = false;
        if (res !== null) {
          let tmp: string[] = [];
          for (let i = 0; i < res.length; i++) {
            let index = this.selected.indexOf(res[i].user);
            if (index < 0) {
              tmp.push(res[i].user);
            }
          }
          this.response.list = tmp;
        }
      });
  }

  onSelection(user) {
    this.selected.push(user);
    let index = this.response.list.indexOf(user);
    if (index >= 0) {
      this.response.list.splice(index, 1);
    }
  }

  onRemove(user) {
    let index = this.selected.indexOf(user);
    if (index >= 0) {
      this.selected.splice(index, 1);
      if (user.match(new RegExp(this.query.value + '*'))) {
        this.response.list.unshift(user);
      }
    }
  }

  resetFilter() {
    this.query.reset();
    this.response = { list: [], pending: false };
  }

  beforeClose() {
    return { action: 'add', selected: this.selected };
  }

  onNoClick() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}

enum gStatus {
  offline = 'offline',
  online = 'online',
  busy = 'busy',
  away = 'away'
}