import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'friendfilter'
})
export class FriendfilterPipe implements PipeTransform {

  transform(items: any, query: string): any {
    if (query === undefined) {
      return items;
    }
    return items.filter(item => item.username.indexOf(query) !== -1);
  }

}