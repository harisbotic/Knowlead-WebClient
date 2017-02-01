import { Injectable } from '@angular/core';
import { BaseNotificationSource } from './notification.source';
import { NotificationModelType } from '../../models/dto';
import * as _ from 'lodash';

@Injectable()
export class MockNotificationsService extends BaseNotificationSource {

  constructor() { super(); this.setUnread(10); this.loadMore(); }

  loadMore() {
    this.addNotifications(_.times(5, () => {
      return {
        type: NotificationModelType.test,
        fromId: undefined,
        from: undefined,
        timestamp: new Date(2000 + Math.random() * 5, Math.random() * 12),
        read: Math.random() > 0.5
      };
    }));
  }

  markAsRead() {
    this.markAsReadHelper();
  }

}
