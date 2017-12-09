import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-roomcreationdialog',
  templateUrl: './roomcreationdialog.component.html',
  styleUrls: ['./roomcreationdialog.component.css']
})
export class RoomcreationdialogComponent implements OnInit {

  @Input() friends: Friend[];

  constructor(
    public dialog: MatDialog,
    private socketService: SocketService
  ) { }

  ngOnInit() {
  }

  openDialog() {
    let dialogRef = this.dialog.open(Dialogview, {
      width: '350px',
      data: {
        friends: this.friends
      }
    });

    dialogRef.afterClosed().subscribe((res: { name: string, guests: string[] }) => {
      if (res && res.name) {
        if (res.guests && res.guests.length > 0) {
          this.socketService.createRoomAction(res.name, res.guests);
        } else {
          this.socketService.createRoomAction(res.name);
        }
      }
    });
  }

}

@Component({
  selector: 'app-dialogview',
  templateUrl: './dialogview.html',
  styleUrls: ['./dialogview.css']
})
export class Dialogview {

  private fg: FormGroup;
  private name: FormControl;

  private selectedGuests: string[];

  get is_valid_name(): boolean { return this.name.errors && (this.name.dirty || this.name.touched); }

  constructor(
    public dialogRef: MatDialogRef<Dialogview>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder
  ) {
    this.selectedGuests = [];
  }

  ngOnInit() {
    this.name = new FormControl(null, {
      validators: [Validators.required]
    });
    this.fg = this._fb.group({
      name: this.name
    });
  }

  onSelectionChanged(list) {
    this.selectedGuests = list.selectedOptions.selected.map(item => item.value);
  }

  beforeClose() {
    return {
      name: this.fg.controls.name.value,
      guests: this.selectedGuests
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

}

interface Friend {
  username: string;
  online: boolean;
}
