import { Pipe, PipeTransform } from '@angular/core';
import { _BlobModel } from '../models/dto';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  transform(value: _BlobModel, args?: any): any {
    if (value) {
      let ret = value.filename;
      if (value.extension) {
        ret += '.' + value.extension;
      }
      return ret;
    }
  }

}
