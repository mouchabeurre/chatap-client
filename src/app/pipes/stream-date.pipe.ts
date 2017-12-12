import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'streamDate'
})
export class StreamDatePipe implements PipeTransform {

  transform(value: string): string {
    let prefix: string;
    const now = new Date();
    const d = new Date(value);
    const tmpM = d.getMinutes();
    const minutes = (tmpM < 10) ? '0' + tmpM : tmpM;
    const tmpH = d.getHours();
    const hours = (tmpH < 10) ? '0' + tmpH : tmpH;
    const days = Math.round(Math.abs(Math.round(Math.abs(Math.round(Math.abs(Math.round(Math.abs((now.getTime() - d.getTime()) / 1000)) / 60)) / 60)) / 24));
    if (days < 1) {
      prefix = 'Today';
    } else if (days < 2) {
      prefix = 'Yesterday';
    } else {
      prefix = d.toDateString();
    }
    return prefix + ' at ' + hours + ':' + minutes;
  }

}
