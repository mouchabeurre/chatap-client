import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-toolbar-account',
  templateUrl: './toolbar-account.component.html',
  styleUrls: ['./toolbar-account.component.css']
})
export class ToolbarAccountComponent implements OnInit {
  private user: string;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private socketService: SocketService,
    private _authService: AuthService
  ) {
    this.user = this._authService.user.userIdentity;
  }

  ngOnInit() {
  }

  openConfirmLogout() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        description: 'You are about to end your session. You will be redirected to the login screen.',
        confirm_statement: 'Please confirm that you want to logout.'
      }
    });

    dialogRef.afterClosed().subscribe((res: { confirmed: boolean }) => {
      if (res && res.confirmed) {
        this.router.navigate(['/connect']);
        this._authService.clearToken();
        this.socketService.logout();
      }
    });
  }

}
