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
import { ApplicationUserModel, FriendshipModel, FriendshipStatus, NewChatMessage, ChatMessageModel, Guid } from '../models/dto';
import { AccountService } from './account.service';
import * as _ from 'lodash';
import { RealtimeService } from './realtime.service';
import { GET_CHAT_CONVERISATION } from '../utils/urls';

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
  // Only latest messages from converisations, sorted by timestamp
  // private history: ConverisationMessageModel[] = [];
  // Message source
  public allMessages = new Subject<ConverisationMessageModel>();

  private static messageSorting(a: ChatMessageModel, b: ChatMessageModel): number {
    return a.timestamp.getTime() - b.timestamp.getTime();
  }

  public getFriends(refresh?: boolean): Observable<FriendshipModel[]> {
    if (refresh) {
      this.storageService.refreshStorage('friends', this.fillerArr);
    }
    return this.storageService.getFromStorage<FriendshipModel[]>('friends', this.fillerArr)
      .map(friends => friends ? friends.filter(friend => this.me && (friend.applicationUserBiggerId === this.me.id ||
                                                friend.applicationUserSmallerId === this.me.id)) : friends);
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
        storageService.refreshStorage('friends', this.fillerArr, undefined);
      }
    });
  }

  public sendMessage(message: NewChatMessage) {
    this.realtimeService.sendChatMessage(message);
  }

  private messageToConverisationMessage = (message: ChatMessageModel): ConverisationMessageModel => {
    const ret: ConverisationMessageModel = <any>message;
    if (message.senderId !== this.me.id) {
      ret.converisation = message.sendToId;
    } else {
      ret.converisation = message.senderId;
    }
    return ret;
  }

  public receiveMessage(message: ChatMessageModel) {
    if (!this.me) {
      console.error('Me was not loaded ... couldn\'t store chat message');
      return;
    }
    let converisationMessage = this.messageToConverisationMessage(message);
    this.allMessages.next(converisationMessage);
    this.changeMessages(converisationMessage.converisation, messages => {
      messages.push(converisationMessage);
      return messages;
    });
  }

  private changeMessages(converisation: Guid, modificator: (messages: ConverisationMessageModel[]) => ConverisationMessageModel[]) {
    if (this.converisations[converisation]) {
      this.converisations[converisation].take(1).subscribe(messages => {
        messages = modificator(messages);
        messages.sort(ChatService.messageSorting);
        this.converisations[converisation].next(messages);
      });
    }
  }

  public getConverisation(converisation: Guid): Observable<ConverisationMessageModel[]> {
    if (!this.converisations[converisation]) {
      this.converisations[converisation] = new BehaviorSubject<ConverisationMessageModel[]>([]);
      const params = new URLSearchParams();
      params.set('numItems', '20');
      params.set('fromRowKey', '636245926772626749');
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
      let idx = _.findIndex(friends, x => x.applicationUserBiggerId === otherId || x.applicationUserSmallerId === otherId);
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
