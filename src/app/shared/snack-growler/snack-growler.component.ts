import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackService } from '../snack.service';
import { SNACK } from '../models/snack';

@Component({
  selector: 'app-snack-growler',
  templateUrl: './snack-growler.component.html',
  styleUrls: ['./snack-growler.component.css']
})
export class SnackGrowlerComponent implements OnInit {

  constructor(
    private _snackService: SnackService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this._snackService.growls.subscribe(
      (data: SNACK) => {
        this.openSnackBar(data);
      });
  }

  openSnackBar(data: SNACK) {
    this._snackBar.open(data.message, data.action, {
      duration: data.duration,
    });
  }

}
