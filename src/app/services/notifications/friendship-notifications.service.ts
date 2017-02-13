import { Injectable } from '@angular/core';
import { BaseNotificationSource } from './notification.source';
import { ChatService } from '../chat.service';
import { ApplicationUserModel } from '../../models/dto';
import { AccountService } from '../account.service';
import { ModelUtilsService } from '../model-utils.service';
import { NotificationTypes } from '../../models/constants';

@Injectable()
export class FriendshipNotificationsService extends BaseNotificationSource {
  canMarkAsRead = false;
  user: ApplicationUserModel;

  constructor(protected chatService: ChatService,
      protected accountService: AccountService,
      modelUtilsService: ModelUtilsService) {
    super(modelUtilsService);
  }

  loadMore() {
    this.reset();
    this.chatService.getFriends(true).take(1).subscribe(friendships => {
      this.stats.total = friendships.length;
      this.stats.unread = friendships.length;
      this.refreshStats();
      this.accountService.currentUser().filter(user => !!user).take(1).subscribe(user => {
        this.addNotifications(
          friendships.filter(f =>
            ModelUtilsService.canAcceptFriendship(f, user.id)
          ).map(f => {
            return {
              notificationId: '',
              notificationType: NotificationTypes.newFriendship,
              fromApplicationUserId: ModelUtilsService.getOtherFriendId(f, user.id),
              fromApplicationUser: ModelUtilsService.getOtherFriend(f, user.id),
              timestamp: f.createdAt,
              p2pId: undefined,
              p2p: undefined,
              scheduledAt: f.createdAt,
              seenAt: new Date(),
              p2PMessageId: undefined,
              p2PMessage: undefined
            };
          })
        );
      });
    });
  }

  start() {
    this.loadMore();
  }

  markAsRead() {}

}
