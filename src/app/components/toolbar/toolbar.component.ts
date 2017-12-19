import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.socketService.sidelist_stream.subscribe(
      (res: { event: string, data: any }) => {
        switch (res.event) {
          case 'connected-friends':
            break;
        }
      }
    );
  }

}
