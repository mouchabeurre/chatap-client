import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-guestlist',
  templateUrl: './guestlist.component.html',
  styleUrls: ['./guestlist.component.css']
})
export class GuestlistComponent implements OnInit {
  private status: typeof gStatus;

  @Input() guests: { user: string, privilege: string, status: gStatus }[];

  constructor() {
    this.status = gStatus;
  }

  ngOnInit() {
  }

}

enum gStatus {
  offline = 'offline',
  online = 'online',
  busy = 'busy',
  away = 'away'
}