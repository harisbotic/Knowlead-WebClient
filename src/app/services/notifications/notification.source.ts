import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import { NotificationModel, NotificationSourceStats, NotebookModel } from '../../models/dto';

export interface NotificationSource {
  canLoadMore: boolean;
  canMarkAsRead: boolean;
  getNotificationStream(): Observable<NotificationModel[]>;
  induceNotification(notification: NotificationModel);
  removeNotification(notification: NotificationModel);
  updateNotification(notification: NotificationModel): boolean;
  addNotifications(notifications: NotificationModel[]);
  reset();
  start();
  getStatsStream(): Observable<NotificationSourceStats>;
  getSingleNotificationStream(): Observable<NotificationModel>;
  markAsRead();
  loadMore();
}

export abstract class BaseNotificationSource implements NotificationSource {
  protected notificationStream = new BehaviorSubject<NotificationModel[]>([]);
  protected singleNotificationStream = new Subject<NotificationModel>();
  protected statsStream = new BehaviorSubject<NotificationSourceStats>({unread: 0, total: 0});
  protected notifications: NotificationModel[] = [];
  protected stats: NotificationSourceStats = {unread: 0, total: 0};
  abstract canMarkAsRead: boolean;
  get canLoadMore() {
    return this.stats.total >= this.notifications.length;
  }

  protected notifyNotifications() {
    this.notifications = this.notifications.sort((a, b) => {
      try {
        return b.scheduledAt.getTime() - a.scheduledAt.getTime();
      } catch (e) {
        return 0;
      }
    });
    this.notificationStream.next(this.notifications);
  }

  protected refreshStats() {
    this.statsStream.next(this.stats);
  }

  getNotificationStream() {
    return this.notificationStream;
  }

  getStatsStream() {
    return this.statsStream;
  }

  getSingleNotificationStream() {
    return this.singleNotificationStream;
  }

  reset() {
    this.notifications = [];
    this.notifyNotifications();
    this.stats = {unread: 0, total: 0};
    this.refreshStats();
  }

  addNotifications(notifications: NotificationModel[]) {
    this.notifications = this.notifications.concat(notifications);
    this.notifyNotifications();
  }

  induceNotification(notification: NotificationModel) {
    this.addNotifications([notification]);
    this.stats.total++;
    if (!notification.seenAt) {
      this.stats.unread++;
    }
    this.refreshStats();
  }

  protected getNotificationIndex(notification: NotificationModel) {
    return this.notifications.findIndex((n) => n.notificationId === notification.notificationId);
  }

  removeNotification(notification: NotificationModel) {
    let idx = this.getNotificationIndex(notification);
    if (idx !== -1) {
      this.notifications.splice(idx, 1);
    }
  }

  updateNotification(notification: NotificationModel) {
    let idx = this.getNotificationIndex(notification);
    if (idx !== -1) {
      this.notifications[idx] = notification;
      this.notifyNotifications();
      return true;
    } else {
      console.error('Notification not found for update: ' + notification.notificationId);
      return false;
    }
  }

  protected markAsReadHelper() {
    for (let notification of this.notifications) {
      notification.seenAt = new Date();
    }
    this.notifyNotifications();
    this.stats.unread = 0;
    this.refreshStats();
  }
  abstract markAsRead();
  abstract loadMore();
  abstract start();
}
