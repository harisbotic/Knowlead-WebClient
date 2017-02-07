import { Injectable } from '@angular/core';
import { BaseNotificationSource } from './notification.source';
import * as _ from 'lodash';

@Injectable()
export class MockNotificationsService extends BaseNotificationSource {

  canMarkAsRead = true;

  constructor() { super(); this.stats.unread = 10; this.refreshStats(); this.loadMore(); }

  loadMore() {
    this.addNotifications(_.times(5, () => {
      return {
              notificationId: '',
              notificationType: 'test',
              forApplicationUserId: undefined,
              forApplicationUser: undefined,
              fromApplicationUserId: undefined,
              fromApplicationUser: undefined,
              p2pId: undefined,
              p2p: undefined,
              scheduledAt: new Date(2016 + Math.random() * 1.2, Math.random() * 12),
              seenAt: Math.random() < 0.5 ? new Date() : undefined
      };
    }));
  }

  markAsRead() {
    this.markAsReadHelper();
  }

}
