import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { NotificationModel } from '../../models/notification.model';
import * as _ from 'lodash';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends BaseComponent implements OnInit {

  constructor(protected notificationService: NotificationService) { super(); }

  notifications: NotificationModel[] = [];
  timeout = 5000;

  ngOnInit() {
    this.notificationService.setCallback(this);
  }

  notify(notification: NotificationModel) {
    this.notifications.push(notification);
  }

  onNotificationClose(notification: NotificationModel) {
    this.notifications = _.without(this.notifications, notification);
  }

}
