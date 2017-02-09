import { Injectable } from '@angular/core';
import { BaseNotificationSource } from './notification.source';

@Injectable()
export class UserNotificationsService extends BaseNotificationSource {

  canMarkAsRead = true;

  constructor() { super(); }

  loadMore() {
  }

  markAsRead() {
  }

}
