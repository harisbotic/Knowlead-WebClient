import { Injectable } from '@angular/core';
import { BaseNotificationSource } from './notification.source';
import { NotificationModelType } from '../../models/dto';
import * as _ from 'lodash';

@Injectable()
export class MockNotificationsService extends BaseNotificationSource {

  canMarkAsRead = true;

  constructor() { super(); this.stats.unread = 10; this.refreshStats(); this.loadMore(); }

  loadMore() {
    this.addNotifications(_.times(5, () => {
      return {
        type: NotificationModelType.test,
        fromId: undefined,
        from: undefined,
        timestamp: new Date(2016 + Math.random() * 1.2, Math.random() * 12),
        read: Math.random() > 0.5
      };
    }));
  }

  markAsRead() {
    this.markAsReadHelper();
  }

}
