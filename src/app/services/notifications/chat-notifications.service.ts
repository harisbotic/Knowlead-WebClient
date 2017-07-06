import { Injectable } from '@angular/core';
import { BaseNotificationSource } from './notification.source';
import { ModelUtilsService } from '../model-utils.service';
import { NotificationModel, ConversationModel } from '../../models/dto';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Injectable()
export class ChatNotificationsService extends BaseNotificationSource {
  canMarkAsRead = false;

  private static conversationToNotification(conversation: ConversationModel): NotificationModel {
    return {
      notificationId: conversation.rowKey,
      notificationType: undefined,
      fromApplicationUserId: conversation.rowKey,
      fromApplicationUser: undefined,
      p2pMessageId: undefined,
      p2pMessage: undefined,
      p2pId: undefined,
      p2p: undefined,
      scheduledAt: conversation.timestamp,
      seenAt: conversation.timestamp,
      customText: conversation.lastMessage,
      createdAt: conversation.timestamp
    };
  }

  constructor(modelUtilsService: ModelUtilsService, protected chatService: ChatService, protected router: Router) {
    super(modelUtilsService);
    this.chatService.historySubject
      .map(history => history.map(ChatNotificationsService.conversationToNotification))
      .subscribe(notifications => {
        this.addNotifications(notifications);
      });
  }

  markAsRead() {
  }
  loadMore() {
    this.router.navigate(['/home/messages']);
  }
  start() {
    this.chatService.loadMoreHistory();
  }
  markSingleAsRead(notification: NotificationModel) {
  }


}
