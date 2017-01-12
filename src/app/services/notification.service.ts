import { Injectable } from '@angular/core';
import { NotificationsComponent } from '../components/notifications/notifications.component';
import { NotificationModel } from '../models/notification.model';

@Injectable()
export class NotificationService {

  notificationComponent: NotificationsComponent;

  constructor() { }

  setCallback(notificationComponent: NotificationsComponent) {
    this.notificationComponent = notificationComponent;
  }

  notify(notification: NotificationModel) {
    if (this.notificationComponent) {
      this.notificationComponent.notify(notification);
    }
  }

  error(title: string, subtitle?: string) {
    this.notify({
      title: title,
      subtitle: subtitle,
      type: 'error'
    });
  }

  info(title: string, subtitle?: string) {
    this.notify({
      title: title,
      subtitle: subtitle,
      type: 'info'
    });
  }

}
