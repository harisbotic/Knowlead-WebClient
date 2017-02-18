import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationUserModel } from '../models/dto';

@Pipe({
  name: 'fullName'
})
export class FullNamePipe implements PipeTransform {

  transform(value: ApplicationUserModel, args?: any): any {
    if (value == null) {
      return '...';
    }
    if (!!!value.name || !!!value.surname) {
      return value.email;
    }
    return value.name + ' ' + value.surname;
  }

}
