import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NotificationSource } from '../../../services/notifications/notification.source';
import { NotificationModel } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';
@Component({
  selector: 'app-notification-icon',
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.scss']
})
export class NotificationIconComponent extends BaseComponent implements OnInit {

  notifications: NotificationModel[];
  @Input() notificationSource: NotificationSource;
  @Input() src: string;
  @Input() alt: string;

  @Input() canMarkAsRead = true;

  isOpened = false;

  constructor() { super(); }

  ngOnInit() { }

  scrolled() {
    this.notificationSource.loadMore();
  }

}
