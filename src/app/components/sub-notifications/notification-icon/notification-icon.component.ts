import { Component, OnInit, Input } from '@angular/core';
import { NotificationSource } from '../../../services/notifications/notification.source';
import { NotificationModel, NotificationSourceStats } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';
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

  constructor() { super(); }

  ngOnInit() {
    this.subscriptions.push(this.notificationSource.getStatsStream().subscribe(stats => this.stats = stats));
  }

  scrolled() {
    this.notificationSource.loadMore();
  }

  markAsRead() {
    this.notificationSource.markAsRead();
  }

}
