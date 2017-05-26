import { Component, OnInit, Input, Type } from '@angular/core';
import { NotificationSource } from '../../../services/notifications/notification.source';
import { NotificationModel, NotificationSourceStats } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';
import { UserSingleNotificationComponent } from '../user-single-notification/user-single-notification.component';
import { FriendshipNotificationsService } from '../../../services/notifications/friendship-notifications.service';
import { FriendsSingleNotificationComponent } from '../friends-single-notification/friends-single-notification.component';
import { MessageSingleNotificationComponent } from '../message-single-notification/message-single-notification.component';
import { ChatNotificationsService } from '../../../services/notifications/chat-notifications.service';
import { UserNotificationsService } from '../../../services/notifications/user-notifications.service';
@Component({
  selector: 'app-notification-icon',
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.scss']
})
export class NotificationIconComponent extends BaseComponent implements OnInit {

  notifications: NotificationModel[];
  @Input() notificationSource: NotificationSource;
  @Input() iconClass: string;
  @Input() notificationTitle: string;
  @Input() canMarkAsRead = true;

  stats: NotificationSourceStats;
  isOpened = false;
  Math = Math;
  component: typeof BaseComponent;

  constructor() { super(); }

  ngOnInit() {
    if (this.notificationSource) {
      this.subscriptions.push(this.notificationSource.getStatsStream().subscribe(stats => this.stats = stats));
      this.subscriptions.push(this.notificationSource.getNotificationStream().subscribe(notifications => {
        this.notifications = notifications;
      }));
    }
    if (this.notificationSource instanceof FriendshipNotificationsService) {
      this.component = FriendsSingleNotificationComponent;
    }
    if (this.notificationSource instanceof ChatNotificationsService) {
      this.component = MessageSingleNotificationComponent;
    }
    if (this.notificationSource instanceof UserNotificationsService) {
      this.component = UserSingleNotificationComponent;
    }
  }

  scrolled() {
    this.notificationSource.loadMore();
  }

  markAsRead() {
    this.notificationSource.markAsRead();
  }

  getIconClass() {
    const ret = {'icon': true};
    ret[this.iconClass] = true;
    return ret;
  }

  markSingleAsRead(notification: NotificationModel) {
    this.notificationSource.markSingleAsRead(notification);
  }
}
