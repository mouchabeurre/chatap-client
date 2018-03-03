import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-thread-creation',
  templateUrl: './thread-creation.component.html',
  styleUrls: ['./thread-creation.component.css']
})
export class ThreadCreationComponent implements OnInit {

  public fg: FormGroup;
  public name: FormControl;

  get is_valid_name(): boolean { return this.name.errors && (this.name.dirty || this.name.touched); }

  constructor(
    public dialogRef: MatDialogRef<ThreadCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.name = new FormControl(null, {
      validators: [Validators.required]
    });
    this.fg = this._fb.group({
      name: this.name
    });
  }

  beforeClose() {
    return {
      name: this.fg.controls.name.value
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
