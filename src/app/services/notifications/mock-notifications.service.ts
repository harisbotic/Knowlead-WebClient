import { Injectable } from '@angular/core';
import { BaseNotificationSource } from './notification.source';
import { times } from 'lodash';

@Injectable()
export class MockNotificationsService extends BaseNotificationSource {

  canMarkAsRead = true;

  constructor() { super(undefined); this.stats.unread = 10; this.refreshStats(); this.loadMore(); }

  loadMore() {
    this.addNotifications(times(5, () => {
      return {
        notificationId: '',
        notificationType: 'test',
        fromApplicationUserId: undefined,
        fromApplicationUser: undefined,
        p2pId: undefined,
        p2p: undefined,
        scheduledAt: new Date(2016 + Math.random() * 1.2, Math.random() * 12),
        seenAt: Math.random() < 0.5 ? new Date() : undefined,
        p2pMessageId: undefined,
        p2pMessage: undefined,
        customText: undefined,
        createdAt: undefined
      };
    }));
  }

  markAsRead() {
    this.markAsReadHelper();
  }

  start() {
    this.loadMore();
  }

  markSingleAsRead() {}

}
