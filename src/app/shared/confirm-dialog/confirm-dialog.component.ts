import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  public description: string;
  public confirm_statement: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.description = this.data.description;
    this.confirm_statement = this.data.confirm_statement;
  }

  ngOnInit() {
  }

  beforeClose() {
    return {
      confirmed: true
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
