import { Injectable } from '@angular/core';
import { NotificationsComponent } from '../../components/sub-popups/notifications/notifications.component';
import { ResponseModel, NotificationModel } from '../../models/dto';
import { PopupNotificationModel } from '../../models/frontend.models';
import { FriendshipNotificationsService } from './friendship-notifications.service';
import { UserNotificationsService } from './user-notifications.service';
import { NotificationTypes } from '../../models/constants';
import { SessionService, SessionEvent } from '../session.service';
import { ModelUtilsService } from '../model-utils.service';
import { Subscription } from 'rxjs';
import { NotificationSource } from './notification.source';
import { P2pService } from '../p2p.service';

@Injectable()
export class NotificationService {

  notificationComponent: NotificationsComponent;

  subscriptions: {[index: string]: Subscription} = {};

  constructor(public friendshipNotificationService: FriendshipNotificationsService,
              public userNotificationsService: UserNotificationsService,
              // WHEN ADDING NEW SOURCE DON'T FORGET TO RESET IT ON LOG OUT
              protected sessionService: SessionService,
              protected p2pService: P2pService,
              protected modelUtilsService: ModelUtilsService) {
    this.resetSources();
    this.sessionService.eventStream.subscribe(evt => {
      if (evt === SessionEvent.LOGGED_OUT) {
        this.resetSources();
      } else if (evt === SessionEvent.LOGGED_IN) {
        this.startSources();
      }
    });
  }

  private resetSources() {
    this.friendshipNotificationService.reset();
    this.userNotificationsService.reset();
  }

  private startSources() {
    this.friendshipNotificationService.start();
    this.userNotificationsService.start();
  }

  receiveNotification(notification: NotificationModel) {
    if (notification.notificationId == null) {
      console.error('Notification has no ID');
      return;
    }
    if (this.subscriptions[notification.notificationId]) {
      console.error('Received duplicate notification: ' + notification.notificationId);
      return;
    }

    // TODO: MAKE THIS CLEANER
    console.log(notification);
    if (notification.p2pId) {
      this.p2pService.refreshP2P(notification.p2pId);
    }

    const tmp = this.getSource(notification);
    if (tmp != null) {
      tmp.induceNotification(notification);
      this.subscriptions[notification.notificationId] = this.modelUtilsService.fillNotification(notification).subscribe(newNotification => {
        if (!tmp.updateNotification(newNotification)) {
          this.removeNotification(newNotification);
        }
      });
    }
  }

  private removeNotification(notification: NotificationModel) {
    if (!this.subscriptions[notification.notificationId]) {
      console.error('Notification not found for removal: ' + notification.notificationId);
      return;
    }
    this.subscriptions[notification.notificationId].unsubscribe();
    delete this.subscriptions[notification.notificationId];
  }

  getSource(notification: NotificationModel): NotificationSource {
    if (notification.notificationType === NotificationTypes.newP2PComment) {
      return this.userNotificationsService;
    } else {
      console.error('Unsupported notification type');
      return undefined;
    }
  }

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
