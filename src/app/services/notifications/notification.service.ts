import { Injectable } from '@angular/core';
import { NotificationsComponent } from '../../components/sub-popups/notifications/notifications.component';
import { ResponseModel, NotificationModel } from '../../models/dto';
import { PopupNotificationModel } from '../../models/frontend.models';
import { FriendshipNotificationsService } from './friendship-notifications.service';
import { UserNotificationsService } from './user-notifications.service';
import { NotificationTypes } from '../../models/constants';
import { SessionService, SessionEvent } from '../session.service';
import { ModelUtilsService } from '../model-utils.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { NotificationSource } from './notification.source';
import { P2pService } from '../p2p.service';
import { RealtimeService } from '../realtime.service';
import { ChatNotificationsService } from './chat-notifications.service';

@Injectable()
export class NotificationService {

  notificationComponent: NotificationsComponent;

  showHeaderSubject = new BehaviorSubject<boolean>(true);

  subscriptions: {[index: string]: Subscription} = {};

  constructor(public friendshipNotificationService: FriendshipNotificationsService,
              public userNotificationsService: UserNotificationsService,
              public chatNotificationsService: ChatNotificationsService,
              // WHEN ADDING NEW SOURCE DON'T FORGET TO RESET IT ON LOG OUT
              protected sessionService: SessionService,
              public realtimeService: RealtimeService,
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
    this.realtimeService.notificationSubject.subscribe((notification) => {
      this.receiveNotification(notification);
    });
  }

  private resetSources() {
    this.friendshipNotificationService.reset();
    this.userNotificationsService.reset();
    this.chatNotificationsService.reset();
  }

  private startSources() {
    this.friendshipNotificationService.start();
    this.userNotificationsService.start();
    this.chatNotificationsService.start();
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

  public showHeader() {
    this.showHeaderSubject.next(true);
  }

  public hideHeader() {
    this.showHeaderSubject.next(false);
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
    return this.userNotificationsService;
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

  openFeedbackForm(text?: string) {
    if (this.notificationComponent) {
      this.notificationComponent.openFeedbackForm(text);
    }
  }

}
