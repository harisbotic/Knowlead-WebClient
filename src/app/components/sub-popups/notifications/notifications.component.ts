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

  notifications: PopupNotificationModel[] = [];
  timeout = 5000;
  feedbackFormOpened = false;

  p2pFeedbackFormOpened = false;
  p2pFeedbackFormId: number;

  constructor(protected notificationService: NotificationService) { super(); }

  ngOnInit() {
    this.notificationService.setCallback(this);
  }

  notify(notification: PopupNotificationModel) {
    this.notifications.push(notification);
  }

  onNotificationClose(notification: PopupNotificationModel) {
    this.notifications = _.without(this.notifications, notification);
  }

  openFeedbackForm(text?: string) {
    this.feedbackFormOpened = true;
  }

  openP2pFeedbackForm(id: number) {
    this.p2pFeedbackFormId = id;
    this.p2pFeedbackFormOpened = true;
  }

}
