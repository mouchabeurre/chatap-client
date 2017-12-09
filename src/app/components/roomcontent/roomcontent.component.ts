import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-roomcontent',
  templateUrl: './roomcontent.component.html',
  styleUrls: ['./roomcontent.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RoomcontentComponent implements OnInit {

  private myInnerHeight: number;

  constructor() {
    this.myInnerHeight = window.innerHeight - 70;
  }

  ngOnInit() {
  }

  onResize(event) {
    this.myInnerHeight = event.target.innerHeight - 70;
  }

}
