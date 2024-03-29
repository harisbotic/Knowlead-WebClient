import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import { NotificationModel, NotificationSourceStats } from '../../models/dto';
import { ModelUtilsService } from '../model-utils.service';
import { Subscription } from 'rxjs';
import { sortByDateFunction } from '../../utils/index';
import { uniqBy } from 'lodash';

export interface NotificationSource {
  canLoadMore: boolean;
  canMarkAsRead: boolean;
  getNotificationStream(): Observable<NotificationModel[]>;
  induceNotification(notification: NotificationModel);
  removeNotification(notification: NotificationModel);
  updateNotification(notification: NotificationModel): boolean;
  addNotifications(notifications: NotificationModel[]);
  markSingleAsRead(notification: NotificationModel);
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
  private fillSubscription: Subscription;

  constructor(protected modelUtilsService: ModelUtilsService) {}

  get canLoadMore() {
    return this.stats.total >= this.notifications.length;
  }

  protected notifyNotifications() {
    this.notifications = this.notifications.slice().sort((a, b) => {
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
    if (this.fillSubscription) {
      this.fillSubscription.unsubscribe();
      delete this.fillSubscription;
    }
    this.notifications = uniqBy(this.notifications
      .concat(notifications)
      .slice()
      .sort(sortByDateFunction<NotificationModel>('scheduledAt', false)),
    'notificationId');
    this.notifyNotifications();
    if (this.modelUtilsService) {
      this.fillSubscription = this.modelUtilsService.fillNotifications(this.notifications).subscribe(filled => {
        this.notifications = filled;
        this.notifyNotifications();
      });
    }
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

  protected markSingleAsReadHelper(notification: NotificationModel) {
    notification.seenAt = new Date();
    this.notifyNotifications();
    this.stats.unread = Math.max(this.stats.unread - 1 , 0);
    this.refreshStats();
  }
  abstract markAsRead();
  abstract loadMore();
  abstract start();
  abstract markSingleAsRead(notification: NotificationModel);
}
