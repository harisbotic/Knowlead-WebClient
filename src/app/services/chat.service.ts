import { Injectable } from '@angular/core';
import { StorageFiller } from './storage.subject';
import { ModelUtilsService } from './model-utils.service';
import { FriendshipDTOActions } from './../models/dto';
import { ChangeFriendshipStatusModel } from './../models/dto';
import { StorageService } from './storage.service';
import { SessionEvent } from './session.service';
import { SessionService } from './session.service';
import { responseToResponseModel } from './../utils/converters';
import { CHANGE_FRIENDSHIP } from './../utils/urls';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ApplicationUserModel, FriendshipModel, FriendshipStatus } from '../models/dto';
import { AccountService } from './account.service';
import * as _ from 'lodash';

@Injectable()
export class ChatService {

  private me: ApplicationUserModel;
  private filler: StorageFiller<FriendshipModel>;
  private fillerArr: StorageFiller<FriendshipModel[]>;

  public getFriends(): Observable<FriendshipModel[]> {
    return this.storageService.getFromStorage<FriendshipModel[]>('friends', this.fillerArr);
  }

  constructor(protected accountService: AccountService,
      protected sessionService: SessionService,
      protected storageService: StorageService,
      protected http: Http,
      protected modelUtilsService: ModelUtilsService) {
    this.filler = this.modelUtilsService.fillFriendship.bind(this.modelUtilsService);
    this.fillerArr = this.modelUtilsService.fillFriendships.bind(this.modelUtilsService);
    this.accountService.currentUser().subscribe((user) => {
      this.me = user;
      if (user) {
        storageService.refreshStorage('friends', this.fillerArr, undefined);
      }
    });
    this.sessionService.eventStream.subscribe(event => {
      if (event === SessionEvent.LOGGED_OUT) {
        storageService.clearCache(this.filler, 'friends');
      }
    });
  }

  changeFriendship(otherId: string, friendship: FriendshipModel) {
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
