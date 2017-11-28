import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-globalayout',
  templateUrl: './globalayout.component.html',
  styleUrls: ['./globalayout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GlobalayoutComponent implements OnInit {

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
