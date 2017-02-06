import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import { NotificationModel, NotificationSourceStats } from '../../models/dto';

export interface NotificationSource {
  canLoadMore: boolean;
  canMarkAsRead: boolean;
  getNotificationStream(): Observable<NotificationModel[]>;
  induceNotification(notification: NotificationModel);
  addNotifications(notifications: NotificationModel[]);
  reset();
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
    if (!notification.seenAt) {
      this.stats.unread++;
      this.stats.total++;
      this.refreshStats();
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

}
