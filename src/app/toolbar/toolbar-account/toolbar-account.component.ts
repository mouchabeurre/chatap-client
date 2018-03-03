import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../shared/auth.service';
import { SnackService } from '../../shared/snack.service';
import { SocketService } from '../../socket/socket.service';
import { SNACK } from '../../shared/models/snack';

@Component({
  selector: 'app-toolbar-account',
  templateUrl: './toolbar-account.component.html',
  styleUrls: ['./toolbar-account.component.css']
})
export class ToolbarAccountComponent implements OnInit {
  public user: string;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private _socketService: SocketService,
    private _snackService: SnackService,
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
        this._socketService.logout();
        this._snackService.generateSnack({ message: 'Successfully disconnected', action: 'Close', duration: 2000 });
        this.router.navigate(['/connect']);
        this._authService.clearToken();
      }
    });
  }

}
