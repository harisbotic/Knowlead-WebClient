import { Injectable, Injector } from '@angular/core';
import { StorageFiller } from './storage.subject';
import { ModelUtilsService } from './model-utils.service';
import { FriendshipDTOActions } from './../models/dto';
import { ChangeFriendshipStatusModel } from './../models/dto';
import { StorageService } from './storage.service';
import { responseToResponseModel } from './../utils/converters';
import { CHANGE_FRIENDSHIP } from './../utils/urls';
import { Http, URLSearchParams } from '@angular/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import { ApplicationUserModel, FriendshipModel, FriendshipStatus, ChatMessageModel, Guid } from '../models/dto';
import { AccountService } from './account.service';
import { RealtimeService } from './realtime.service';
import { GET_CHAT_CONVERISATION, GET_CONVERSATION_HISTORY } from '../utils/urls';
import { sortByDateFunction } from '../utils/index';
import { ConversationModel } from '../models/dto';
import { findIndex, uniqBy } from 'lodash';

export interface ConverisationMessageModel extends ChatMessageModel {
  converisation: Guid;
}

@Injectable()
export class ChatService {

  private me: ApplicationUserModel;
  private filler: StorageFiller<FriendshipModel>;
  private fillerArr: StorageFiller<FriendshipModel[]>;

  // All messages grouped by converisations
  private converisations: {[index: string]: BehaviorSubject<ConverisationMessageModel[]>} = {};
  // Message source
  public allMessagesSubject = new Subject<ConverisationMessageModel>();
  // History source
  public historySubject = new BehaviorSubject<ConversationModel[]>([]);

  public getFriends(refresh?: boolean): Observable<FriendshipModel[]> {
    if (refresh) {
      this.storageService.refreshStorage('friends', this.fillerArr);
    }
    return this.storageService.getFromStorage<FriendshipModel[]>('friends', this.fillerArr)
      .combineLatest(this.accountService.currentUser(), (friends, user) => { return {friends: friends, me: user}; })
      .map(data => data.friends ? data.friends.filter(friend => data.me && (friend.applicationUserBiggerId === data.me.id ||
                                                friend.applicationUserSmallerId === data.me.id) &&
                                                friend.status !== FriendshipStatus.Declined) : data.friends);
  }

  get realtimeService(): RealtimeService {
    return this.injector.get(RealtimeService);
  }

  constructor(protected accountService: AccountService,
      protected storageService: StorageService,
      protected http: Http,
      protected modelUtilsService: ModelUtilsService,
      protected injector: Injector) {
    this.filler = this.modelUtilsService.fillFriendship.bind(this.modelUtilsService);
    this.fillerArr = this.modelUtilsService.fillFriendships.bind(this.modelUtilsService);
    this.accountService.currentUser().subscribe((user) => {
      this.me = user;
      if (user) {
        storageService.refreshStorage('friends', this.fillerArr);
      }
    });
  }

  public sendMessage(message: ChatMessageModel) {
    this.realtimeService.sendChatMessage(message);
  }

  private messageToConverisationMessage = (message: ChatMessageModel): ConverisationMessageModel => {
    const ret: ConverisationMessageModel = <any>message;
    if (message.recipientId !== this.me.id) {
      ret.converisation = message.recipientId;
    } else {
      ret.converisation = message.senderId;
    }
    return ret;
  }

  private messageToHistory(converisationMessage: ConverisationMessageModel) {
    return {
      rowKey: converisationMessage.converisation,
      isMessageSender: this.me.id === converisationMessage.senderId,
      lastMessage: converisationMessage.message,
      timestamp: converisationMessage.timestamp
    }
  }

  public receiveMessage(message: ChatMessageModel) {
    if (!this.me) {
      console.error('Me was not loaded ... couldn\'t store chat message');
      return;
    }
    let converisationMessage = this.messageToConverisationMessage(message);
    this.allMessagesSubject.next(converisationMessage);
    this.changeMessages(converisationMessage.converisation, messages => messages.concat([converisationMessage]));
    this.changeHistory(history => history.concat([this.messageToHistory(converisationMessage)]));
  }

  public loadMoreHistory() {
    this.historySubject.take(1).subscribe(conversations => {
      let from = new Date();
      if (conversations && conversations.length > 0) {
        from = conversations[0].timestamp;
      }
      const params = new URLSearchParams();
      params.set('fromDateTime', from.toISOString());
      params.set('numItems', '5');
      this.http.get(GET_CONVERSATION_HISTORY, {search: params})
        .map(responseToResponseModel)
        .map(v => v.object)
        .flatMap(this.modelUtilsService.fillConversations.bind(this.modelUtilsService))
        .take(1)
        .subscribe((newConversations: ConversationModel[]) => {
          this.changeHistory(history => history.concat(newConversations));
        });
    });
  }

  private changeHistory(modificator: (history: ConversationModel[]) => ConversationModel[]) {
    this.historySubject.take(1).subscribe(history => {
      history = modificator(history);
      history.sort(sortByDateFunction<ConversationModel>('timestamp'));
      history = uniqBy(history, 'rowKey');
      this.historySubject.next(history);
    });
  }

  private changeMessages(converisation: Guid, modificator: (messages: ConverisationMessageModel[]) => ConverisationMessageModel[]) {
    if (this.converisations[converisation]) {
      this.converisations[converisation].take(1).subscribe(messages => {
        messages = modificator(messages);
        messages.sort(sortByDateFunction<ConverisationMessageModel>('timestamp', true));
        this.converisations[converisation].next(messages);
      });
    }
  }

  public getConverisation(converisation: Guid): Observable<ConverisationMessageModel[]> {
    if (!this.converisations[converisation]) {
      this.converisations[converisation] = new BehaviorSubject<ConverisationMessageModel[]>([]);
      const params = new URLSearchParams();
      params.set('numItems', '20');
      // params.set('fromRowKey', '636245926772626749');
      this.http.get(GET_CHAT_CONVERISATION + '/' + converisation, {search: params})
        .map(responseToResponseModel)
        .map(a => a.object)
        .subscribe((messages: ChatMessageModel[]) => {
          this.modelUtilsService.fillChatMessages(messages).take(1).subscribe(filled => {
            this.changeMessages(converisation, old => old.concat(
              filled.map(this.messageToConverisationMessage)
            ));
          });
        });
    }
    return this.converisations[converisation];
  }

  private changeFriendship(otherId: string, friendship: FriendshipModel) {
    this.getFriends().take(1).subscribe(friends => {
      let idx = findIndex(friends, x => x.applicationUserBiggerId === otherId || x.applicationUserSmallerId === otherId);
      if (idx !== -1) {
        if (friendship != null) {
          console.debug('Modifying existing friendship');
          friends[idx] = friendship;
        } else {
          console.debug('Removing existing friendship');
          friends.splice(idx, 1);
        }
      } else {
        if (friendship != null) {
          console.debug('Adding new friendship');
          friends.push(friendship);
        } else {
          console.warn('Removing non-existing friendship, this shouldn\'t happen ...');
        }
      }
      this.storageService.setToStorage<FriendshipModel[]>('friends', this.fillerArr, undefined, friends);
    });
  }

  getAcceptedFriendsIds(): Observable<string[]> {
    return this.getFriends()
      .map(val => (val === null || val === undefined ? [] : val).filter(friend => friend.status === FriendshipStatus.Accepted))
      .map(val => this.me ? val.map(friend => ModelUtilsService.getOtherFriendId(friend, this.me.id)) : []);
  }

  friendshipActionById(id: string, action: FriendshipDTOActions): Observable<FriendshipModel> {
    if (!this.me) {
      return;
    }
    let change: ChangeFriendshipStatusModel = {applicationUserId: id, action: action};
    this.http.post(CHANGE_FRIENDSHIP, change)
      .map(responseToResponseModel)
      .map(x => x.object)
      .subscribe(x => {
        this.changeFriendship(id, x);
      });
    return this.getFriendshipStatus(id);
  }

  getFriendshipStatus(otherUserId: string): Observable<FriendshipModel> {
    return this.getFriends().map(friends => {
      for (let i = 0; i < friends.length; i++) {
        if (friends[i].applicationUserBiggerId === otherUserId || friends[i].applicationUserSmallerId === otherUserId) {
          return friends[i];
        }
      }
      return null;
    });
  }

}
