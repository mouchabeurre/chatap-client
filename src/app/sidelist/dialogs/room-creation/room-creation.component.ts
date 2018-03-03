import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-room-creation',
  templateUrl: './room-creation.component.html',
  styleUrls: ['./room-creation.component.css']
})
export class RoomCreationComponent implements OnInit {

  public fg: FormGroup;
  public name: FormControl;

  private selectedGuests: string[];

  get is_valid_name(): boolean { return this.name.errors && (this.name.dirty || this.name.touched); }

  constructor(
    public dialogRef: MatDialogRef<RoomCreationComponent>,
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
