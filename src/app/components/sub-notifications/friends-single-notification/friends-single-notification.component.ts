import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { ChatService } from '../../../services/chat.service';
import { NotificationModel, FriendshipDTOActions } from '../../../models/dto';
import { FriendshipNotificationsService } from '../../../services/notifications/friendship-notifications.service';

@Component({
  selector: 'app-friends-single-notification',
  templateUrl: './friends-single-notification.component.html',
  styleUrls: ['./friends-single-notification.component.scss']
})
export class FriendsSingleNotificationComponent extends BaseComponent implements OnInit {

  @Input() notification: NotificationModel;

  constructor(protected chatServce: ChatService, protected friendshipNotificationService: FriendshipNotificationsService) { super(); }

  ngOnInit() {
  }

  doAction(action) {
    this.subscriptions.push(
      this.chatServce.friendshipActionById(this.notification.fromApplicationUserId, action).subscribe(() => {
        // this will reload notification source
        this.friendshipNotificationService.loadMore();
      })
    );
  }

  acceptFriend() {
    this.doAction(FriendshipDTOActions.AcceptRequest);
  }

  declineFriend() {
    this.doAction(FriendshipDTOActions.DeclineRequest);
  }

}
