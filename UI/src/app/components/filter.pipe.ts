import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(values: any[], fullName: string): any {
    if(!values || !filter){
      return values
    }
    return values.filter(item => item.albumOwnerName === fullName);
  }
  }