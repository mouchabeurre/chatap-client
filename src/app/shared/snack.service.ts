import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SNACK } from './models/snack';

@Injectable()
export class SnackService {
  public growls: Subject<SNACK>;

  constructor() {
    this.growls = new Subject<SNACK>();
  }

  public generateSnack(data: SNACK) {
    this.growls.next(data);
  }

}
