import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notifications/notification.service';
import * as _ from 'lodash';
import { BaseComponent } from '../../../base.component';
import { PopupNotificationModel } from '../../../models/frontend.models';
import { FeedbackService } from '../../../services/feedback.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [FeedbackService]
})
export class NotificationsComponent extends BaseComponent implements OnInit {

  notification: PopupNotificationModel;
  timeout = 5000;
  feedbackFormOpened = false;

  p2pFeedbackFormOpened = false;
  p2pFeedbackFormId: number;
  timeoutNotification: any;

  constructor(protected notificationService: NotificationService) { super();
 }

  ngOnInit() {
    this.notificationService.setCallback(this);
  }

  notify(notification: PopupNotificationModel) {
      if ( this.notification ) {
        clearTimeout(this.timeoutNotification);
      }

      this.timeoutNotification = setTimeout( () => {
        this.onNotificationClose()
      }, this.timeout);
      this.notification = notification;
  }

  onNotificationClose() {
    delete this.notification;
  }

  openFeedbackForm(text?: string) {
    this.feedbackFormOpened = true;
  }

  openP2pFeedbackForm(id: number) {
    this.p2pFeedbackFormId = id;
    this.p2pFeedbackFormOpened = true;
  }

}
