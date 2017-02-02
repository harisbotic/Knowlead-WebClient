import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notifications/notification.service';
import * as _ from 'lodash';
import { BaseComponent } from '../../../base.component';
import { PopupNotificationModel } from '../../../models/frontend.models';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends BaseComponent implements OnInit {

  notifications: PopupNotificationModel[] = [];
  timeout = 5000;

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

}
