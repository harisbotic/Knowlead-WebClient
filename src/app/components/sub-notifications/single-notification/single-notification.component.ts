import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NotificationModel } from '../../../models/dto';
import { NotificationTypes } from '../../../models/constants';

@Component({
  selector: 'app-single-notification',
  templateUrl: './single-notification.component.html',
  styleUrls: ['./single-notification.component.scss']
})
export class SingleNotificationComponent implements OnInit {

  @Input() notification: NotificationModel;
  @Output() markAsRead = new EventEmitter<NotificationModel>();

  constructor() {
  }

  ngOnInit() { }

  sendMarkAsRead() {
    this.markAsRead.emit(this.notification);
  }

  getLink() {
    if (this.notification.p2pId) {
      return '/home/p2p/' + this.notification.p2pId;
    } else if (this.notification.notificationType === NotificationTypes.rewardClaimed) {
      return '/store';
    } else {
      return undefined;
    }
  }

  getBefore() {
    if (this.notification.notificationType === NotificationTypes.newP2PComment) {
      return 'commented on your';
    } else if (this.notification.notificationType === NotificationTypes.p2POfferAccepted) {
      return 'accepted your';
    } else if (this.notification.notificationType === NotificationTypes.rewardClaimed) {
      return 'You claimed your';
    }
  }

  getMiddle() {
    if (this.notification.notificationType === NotificationTypes.newP2PComment ||
        this.notification.notificationType === NotificationTypes.p2POfferAccepted) {
      return 'peer-to-peer';
    } else if (this.notification.notificationType === NotificationTypes.rewardClaimed) {
      return 'reward';
    }
  }

  getAfter() {
    if (this.notification.notificationType === NotificationTypes.newP2PComment) {
      return 'request';
    } else if (this.notification.notificationType === NotificationTypes.p2POfferAccepted) {
      return 'offer';
    }
  }

}
