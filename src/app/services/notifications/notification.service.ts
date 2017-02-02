import { Injectable } from '@angular/core';
import { NotificationsComponent } from '../../components/sub-popups/notifications/notifications.component';
import { ResponseModel } from '../../models/dto';
import { PopupNotificationModel } from '../../models/frontend.models';

@Injectable()
export class NotificationService {

  notificationComponent: NotificationsComponent;

  constructor() { }

  setCallback(notificationComponent: NotificationsComponent) {
    this.notificationComponent = notificationComponent;
  }

  notify(notification: PopupNotificationModel) {
    if (this.notificationComponent) {
      this.notificationComponent.notify(notification);
    }
  }

  error(title: string, subtitle?: string | ResponseModel) {
    let subtitleString = <string>subtitle;
    if (typeof(subtitle) === 'object' && (<ResponseModel>subtitle).errors) {
      subtitleString = (<ResponseModel>subtitle).errors[0];
    }
    this.notify({
      title: title,
      subtitle: subtitleString,
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
