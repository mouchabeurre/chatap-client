import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-globalayout',
  templateUrl: './globalayout.component.html',
  styleUrls: ['./globalayout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GlobalayoutComponent implements OnInit {

  constructor(
    private socketService: SocketService
  ) {
    this.socketService.login();
  }

  ngOnInit() {
  }

}
