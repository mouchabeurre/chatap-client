import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roomfilter'
})
export class RoomfilterPipe implements PipeTransform {

  transform(items: any, query: string): any {
    if (query === undefined) {
      return items;
    }
    return items.filter(item => {
      if (item.name.indexOf(query) !== -1 || item.id.indexOf(query) !== -1) {
        return item;
      }
      return false;
    });
  }

}
