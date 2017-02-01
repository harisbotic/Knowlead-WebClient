import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import { NotificationModel } from '../../models/dto';

export interface NotificationSource {
  getNotificationStream(): Observable<NotificationModel[]>;
  induceNotification(notification: NotificationModel);
  addNotifications(notifications: NotificationModel[]);
  reset();
  getUnreadStream(): Observable<number>;
  getSingleNotificationStream(): Observable<NotificationModel>;
  markAsRead();
  loadMore();
}

export abstract class BaseNotificationSource implements NotificationSource {
  notificationStream = new BehaviorSubject<NotificationModel[]>([]);
  singleNotificationStream = new Subject<NotificationModel>();
  unreadStream = new BehaviorSubject<number>(0);
  notifications: NotificationModel[] = [];
  unread = 0;

  protected notifyNotifications() {
    this.notificationStream.next(this.notifications);
  }

  protected setUnread(value: number) {
    this.unread = value;
    this.unreadStream.next(value);
  }

  getNotificationStream() {
    return this.notificationStream;
  }

  getUnreadStream() {
    return this.unreadStream;
  }

  getSingleNotificationStream() {
    return this.singleNotificationStream;
  }

  reset() {
    this.notifications = [];
    this.notificationStream.next([]);
    this.setUnread(0);
  }

  addNotifications(notifications: NotificationModel[]) {
    this.notifications = this.notifications.concat(notifications);
    this.notifyNotifications();
  }

  induceNotification(notification: NotificationModel) {
    this.addNotifications([notification]);
    if (!notification.read) {
      this.setUnread(this.unread + 1);
    }
  }

  protected markAsReadHelper() {
    for (let notification of this.notifications) {
      notification.read = false;
    }
    this.notifyNotifications();
    this.setUnread(0);
  }
  abstract markAsRead();
  abstract loadMore();

}
