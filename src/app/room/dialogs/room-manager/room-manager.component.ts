import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-room-manager',
  templateUrl: './room-manager.component.html',
  styleUrls: ['./room-manager.component.css']
})
export class RoomManagerComponent implements OnInit {

  private fg: FormGroup;
  private room_name: FormControl;

  private action: roomActions;
  private title: string;

  get is_valid_name(): boolean { return this.room_name.errors && (this.room_name.dirty || this.room_name.touched); }

  constructor(
    public dialogRef: MatDialogRef<RoomManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder
  ) {
    this.action = this.data.action;
    this.title = this.data.title;
  }

  ngOnInit() {
    switch (this.action) {
      case roomActions.rename:
        this.room_name = new FormControl(this.data.room_name, {
          validators: [Validators.required]
        });
        this.fg = this._fb.group({
          room_name: this.room_name
        });
        break;
      case roomActions.picture:
        break;
      case roomActions.color:
        break;
    }
  }

  beforeClose() {
    switch (this.action) {
      case roomActions.rename:
        return {
          room_name: this.fg.controls.room_name.value
        }
      case roomActions.picture:
        break;
      case roomActions.color:
        break;
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

}

enum roomActions {
  rename = 'rename',
  picture = 'picture',
  color = 'color'
}
