import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs';

@Pipe({
  name: 'albumFilter'
})
export class AlbumFilterPipe implements PipeTransform {

  transform(values: any[], albumName: string): any {
    if(!values || !filter){
      return values
    }
    return values.filter(item => item.albumName === albumName);
  }

}
