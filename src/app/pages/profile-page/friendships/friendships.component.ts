import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { ModelUtilsService } from '../../../services/model-utils.service';
import { AccountService } from '../../../services/account.service';
import { FriendshipStatus, ApplicationUserModel, FriendshipModel, FriendshipDTOActions } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';



@Component({
  selector: 'app-friendships',
  templateUrl: './friendships.component.html',
  styleUrls: ['./friendships.component.scss']
})
export class FriendshipsComponent extends BaseComponent implements OnInit {

  FriendshipStatus = FriendshipStatus;
  me: ApplicationUserModel;
  friendList: FriendshipModel[];
  acceptedRequests: FriendshipModel[];
  pendingRequests: FriendshipModel[];
  blockedUsers: FriendshipModel[];

  constructor(protected chatService: ChatService, protected accountService: AccountService) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe(user =>
      this.me = user
    ),
    this.chatService.getFriends().subscribe(friendship => {
      this.friendList = friendship;

      this.acceptedRequests = this.friendList.filter( friendshipAccept => {
        return friendshipAccept.status === 1;
      });

      this.pendingRequests = this.friendList.filter( friendshipPending => {
        return friendshipPending.status === 0;
      });

      this.blockedUsers = this.friendList.filter( friendshipBlocked => {
        return friendshipBlocked.status === 3;
      });
    }));

  }

  myRequest(value: FriendshipModel) {
    return value.lastActionById === this.me.id;
  }

  notMyRequest(value: FriendshipModel) {
    return value.lastActionById !== this.me.id;
  }

  otherUser(value: FriendshipModel) {
    return this.me && ModelUtilsService.getOtherFriend(value, this.me.id);
  }

  otherUserId(value: FriendshipModel) {
    return this.me && ModelUtilsService.getOtherFriendId(value, this.me.id);
  }

}
