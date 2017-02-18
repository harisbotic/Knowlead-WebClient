import { Component, OnInit, Input } from '@angular/core';
import { NotificationModel } from '../../../models/dto';
import { ModelUtilsService } from '../../../services/model-utils.service';
import { NotificationTypes } from '../../../models/constants';

@Component({
  selector: 'app-single-notification',
  templateUrl: './single-notification.component.html',
  styleUrls: ['./single-notification.component.scss']
})
export class SingleNotificationComponent implements OnInit {

  @Input() notification: NotificationModel;

  constructor() {
  }

  ngOnInit() { }

  getLink() {
    if (this.notification.p2pId) {
      return '/home/p2p/' + this.notification.p2pId;
    } else {
      return undefined;
    }
  }

  getBefore() {
    if (this.notification.notificationType === NotificationTypes.newP2PComment) {
      return 'commented on your';
    }
  }

  getMiddle() {
    if (this.notification.notificationType === NotificationTypes.newP2PComment) {
      return 'peer-to-peer';
    }
  }

  getAfter() {
    if (this.notification.notificationType === NotificationTypes.newP2PComment) {
      return 'request';
    }
  }

}
