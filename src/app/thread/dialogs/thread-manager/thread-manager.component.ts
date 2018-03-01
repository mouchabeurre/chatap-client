import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-thread-manager',
  templateUrl: './thread-manager.component.html',
  styleUrls: ['./thread-manager.component.css']
})
export class ThreadManagerComponent implements OnInit {

  private fg: FormGroup;
  private thread_name: FormControl;

  private action: threadActions;
  private title: string;
  private thread_id: string;

  get is_valid_name(): boolean { return this.thread_name.errors && (this.thread_name.dirty || this.thread_name.touched); }

  constructor(
    public dialogRef: MatDialogRef<ThreadManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder
  ) {
    this.action = this.data.action;
    this.title = this.data.title;
    this.thread_id = this.data.thread_id;
  }

  ngOnInit() {
    switch (this.action) {
      case threadActions.rename:
        this.thread_name = new FormControl(this.data.thread_name, {
          validators: [Validators.required]
        });
        this.fg = this._fb.group({
          thread_name: this.thread_name
        });
        break;
      case threadActions.picture:
        break;
    }
  }

  beforeClose() {
    switch (this.action) {
      case threadActions.rename:
        return {
          thread_name: this.fg.controls.thread_name.value,
          thread_id: this.thread_id
        }
      case threadActions.picture:
        break;
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

}

enum threadActions {
  rename = 'rename',
  picture = 'picture'
}