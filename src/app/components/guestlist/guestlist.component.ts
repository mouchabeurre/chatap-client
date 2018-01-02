import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-guestlist',
  templateUrl: './guestlist.component.html',
  styleUrls: ['./guestlist.component.css']
})
export class GuestlistComponent implements OnInit {

  @Input() guests: { user: string, privilege: string }[];

  constructor() { }

  ngOnInit() {
  }

}
