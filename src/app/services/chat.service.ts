import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { ApplicationUserModel, FriendshipModel, FriendshipStatus } from '../models/dto';
import { AccountService } from './account.service';
import { ModelUtilsService } from './model-utils.service';

@Injectable()
export class ChatService {

  public friends = new BehaviorSubject<FriendshipModel[]>([]);
  private me: ApplicationUserModel;

  constructor(protected accountService: AccountService) {
    this.accountService.currentUser().subscribe((user) => {
      this.friends.next([]);
      this.me = user;
    });
  }

  getAcceptedFriendsIds(): Observable<string[]> {
    return this.friends
      .map(val => val.filter(friend => friend.status == FriendshipStatus.Accepted))
      .map(val => this.me ? val.map(friend => ModelUtilsService.getOtherFriendId(friend, this.me.id)) : []);
  }

  addFriendById(id: string): Observable<FriendshipModel> {
    if (!this.me)
      return;
    let ret = new Subject<FriendshipModel>();
    Observable.timer(1000).subscribe(() => {
      let sub = this.friends.take(1).subscribe(friends => {
        let tmp = {
          applicationUserBiggerId: this.me.id,
          applicationUserSmallerId: id,
          status: FriendshipStatus.Pending
        };
        friends.push(<any>tmp);
        ret.next(<any>tmp);
        this.friends.next(friends);
      }).unsubscribe();
    });
    Observable.timer(6000).subscribe(() => {
      this.friends.take(1).subscribe(friends => {
        friends.forEach(friend => {
          if (friend.applicationUserSmallerId == id)
            friend.status = FriendshipStatus.Accepted;
          ret.next(friend);
          ret.complete();
        });
        this.friends.next(friends);
      }).unsubscribe(); 
    });
    return ret;
  }

  getFriendshipStatus(otherUserId: string): Observable<FriendshipModel> {
    return this.friends.map(friends => {
      for (var i=0; i<friends.length; i++)
        if (friends[i].applicationUserBiggerId == otherUserId || friends[i].applicationUserSmallerId == otherUserId)
          return friends[i];
      return null;
    });
  }

}
