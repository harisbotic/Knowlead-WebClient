import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NotificationModel } from '../../../models/dto';
import { NotificationTypes } from '../../../models/constants';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-user-single-notification',
  templateUrl: './user-single-notification.component.html',
  styleUrls: ['./user-single-notification.component.scss']
})
export class UserSingleNotificationComponent extends BaseComponent implements OnInit {

  @Input() notification: NotificationModel;
  @Output() markAsRead = new EventEmitter<NotificationModel>();

  ngOnInit() { }

  sendMarkAsRead() {
    this.markAsRead.emit(this.notification);
  }

  getLink() {
    if (this.notification.p2pId) {
      if (this.notification.notificationType === NotificationTypes.leaveP2PFeedback) {
        // TODO: Fix this
        // return '/home/p2p/' + this.notification.p2pId + '?feedback=true';
      }
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
    } else if (this.notification.notificationType === NotificationTypes.leaveP2PFeedback) {
      return 'has finished';
    } else if (this.notification.notificationType === NotificationTypes.p2POfferAccepted) {
      return 'accepted your';
    } else if (this.notification.notificationType === NotificationTypes.p2PScheduled) {
      return 'scheduled';
    } else if (this.notification.notificationType === NotificationTypes.rewardClaimed) {
      return 'You claimed your';
    } else if (this.notification.notificationType === NotificationTypes.prepareForP2P) {
      return 'Get ready for'
    } else if (this.notification.customText) {
      return this.notification.customText;
    }
  }

  getMiddle() {
    if (this.notification.notificationType === NotificationTypes.newP2PComment ||
        this.notification.notificationType === NotificationTypes.p2POfferAccepted ||
        this.notification.notificationType === NotificationTypes.p2PScheduled ||
        this.notification.notificationType === NotificationTypes.prepareForP2P) {
      return 'peer-to-peer';
    } else if (this.notification.notificationType === NotificationTypes.rewardClaimed) {
      return 'reward';
    }
  }

  getAfter() {
    if (this.notification.notificationType === NotificationTypes.newP2PComment ||
        this.notification.notificationType === NotificationTypes.p2PScheduled) {
      return 'request.';
    } else if (this.notification.notificationType === NotificationTypes.p2POfferAccepted) {
      return 'offer.';
    } else if (this.notification.notificationType === NotificationTypes.leaveP2PFeedback) {
      return 'session with you. You can leave feedback now.';
    } else if (this.notification.notificationType === NotificationTypes.prepareForP2P) {
      return 'session.';
    }
  }

}
