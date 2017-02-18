import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationUserModel } from '../models/dto';

@Pipe({
  name: 'userProfileLink'
})
export class UserProfileLinkPipe implements PipeTransform {

  transform(value: ApplicationUserModel, args?: any): any {
    if (value) {
      return '/profile/' + value.id;
    } else {
      return '/home';
    }
  }

}
