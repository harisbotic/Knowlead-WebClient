import { Injectable } from '@angular/core';
import { BaseNotificationSource } from './notification.source';
import { Http, URLSearchParams } from '@angular/http';
import { NOTIFICATIONS, NOTIFICATIONS_MARK_AS_READ, NOTIFICATION_STATS } from '../../utils/urls';
import { responseToResponseModel } from '../../utils/converters';
import { NotificationModel, NotificationSourceStats } from '../../models/dto';
import { ModelUtilsService } from '../model-utils.service';

@Injectable()
export class UserNotificationsService extends BaseNotificationSource {

  canMarkAsRead = true;

  constructor(protected http: Http, modelUtilsService: ModelUtilsService) {
    super(modelUtilsService);
  }

  loadMore() {
    const params = new URLSearchParams();
    params.set('offset', this.notifications.length.toString());
    params.set('numItems', '5');
    this.http.get(NOTIFICATIONS, {search: params})
        .map(responseToResponseModel)
        .map(o => o.object)
        .subscribe((notifications: NotificationModel[]) => {
      this.addNotifications(notifications);
    });
  }

  markAsRead() {
    this.http.post(NOTIFICATIONS_MARK_AS_READ, {}).subscribe(() => {
      this.markAsReadHelper();
    });
  }

  loadStats() {
    this.http.get(NOTIFICATION_STATS).map(responseToResponseModel).map(o => o.object)
      .subscribe((stats: NotificationSourceStats) => {
        this.stats = stats;
        this.refreshStats();
      });
  }

  start() {
    this.loadMore();
    this.loadStats();
  }

}
