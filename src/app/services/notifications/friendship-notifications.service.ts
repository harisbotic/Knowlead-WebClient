import { Injectable } from '@angular/core';
import { BaseNotificationSource } from './notification.source';
import { ChatService } from '../chat.service';
import { ApplicationUserModel, NotificationModelType } from '../../models/dto';
import { AccountService } from '../account.service';
import { ModelUtilsService } from '../model-utils.service';

@Injectable()
export class FriendshipNotificationsService extends BaseNotificationSource {
  canMarkAsRead = false;
  user: ApplicationUserModel;

  constructor(protected chatService: ChatService, protected accountService: AccountService) {
    super();
  }

  loadMore() {
    this.reset();
    this.chatService.getFriends(true).subscribe(friendships => {
      this.stats.total = friendships.length;
      this.stats.unread = friendships.length;
      this.refreshStats();
      this.accountService.currentUser().filter(user => !!user).take(1).subscribe(user => {
        this.addNotifications(
          friendships.filter(f =>
            ModelUtilsService.canAcceptFriendship(f, user.id)
          ).map(f => {
            return {
              type: NotificationModelType.friendship,
              fromId: ModelUtilsService.getOtherFriendId(f, user.id),
              from: ModelUtilsService.getOtherFriend(f, user.id),
              timestamp: f.createdAt,
              read: true
            };
          })
        );
      });
    });
  }

  markAsRead() {}

}
