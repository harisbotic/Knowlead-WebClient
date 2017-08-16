import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ModelUtilsService } from '../../services/model-utils.service';
import { AccountService } from '../../services/account.service';
import { FriendshipStatus, ApplicationUserModel, FriendshipModel, FriendshipDTOActions } from '../../models/dto';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-friendship-page',
  templateUrl: './friendship-page.component.html',
  styleUrls: ['./friendship-page.component.scss']
})
export class FriendshipPageComponent extends BaseComponent implements OnInit {

  friendshipStatus = FriendshipStatus;
  actions = FriendshipDTOActions;
  me: ApplicationUserModel;

  constructor(public chatService: ChatService, protected accountService: AccountService) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe(user =>
      this.me = user
    ));
  }

  otherUser(value: FriendshipModel) {
    return this.me && ModelUtilsService.getOtherFriend(value, this.me.id);
  }

  otherUserId(value: FriendshipModel) {
    return this.me && ModelUtilsService.getOtherFriendId(value, this.me.id);
  }

}
