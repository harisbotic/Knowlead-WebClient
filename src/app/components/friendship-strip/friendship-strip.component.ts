import { Component, OnInit, Input } from '@angular/core';
import { FriendshipModel, FriendshipDTOActions, ApplicationUserModel } from '../../models/dto';
import { ModelUtilsService } from '../../services/model-utils.service';
import { ChatService } from '../../services/chat.service';
import { AccountService } from '../../services/account.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-friendship-strip',
  templateUrl: './friendship-strip.component.html',
  styleUrls: ['./friendship-strip.component.scss']
})
export class FriendshipStripComponent extends BaseComponent implements OnInit {

  me: ApplicationUserModel;
  actions = FriendshipDTOActions;
  friendship: FriendshipModel;
  _otherId: string;

  constructor(protected chatService: ChatService, protected accountService: AccountService) { super(); }

  @Input() set otherId(value: string) {
    this._otherId = value;
    this.subscriptions.push(this.chatService.getFriendshipStatus(value).subscribe(friendship => this.friendship = friendship));
  }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => this.me = user));
  }

  isSelf() {
    return this.me && this.me.id === this._otherId;
  }

  doAction(action: FriendshipDTOActions) {
    if (action === undefined) {
      return console.error('Friendship action is undefined');
    }
    this.chatService.friendshipActionById(this._otherId, action);
  }

  canAccept() {
    return this.me && ModelUtilsService.canAcceptFriendship(this.friendship, this.me.id);
  }

  canDecline() {
    return this.me && ModelUtilsService.canDeclineFriendship(this.friendship, this.me.id);
  }

  canCancel() {
    return this.me && ModelUtilsService.canCancelFriendship(this.friendship, this.me.id);
  }

  canBlock() {
    return ModelUtilsService.canBlockFriendship(this.friendship);
  }

  canUnblock() {
    return ModelUtilsService.canUnblockFriendship(this.friendship);
  }

  canRemove() {
    return ModelUtilsService.canRemoveFriendship(this.friendship);
  }

  canAdd() {
    return this.me && ModelUtilsService.canAddFriendship(this.friendship, this.me.id);
  }

}
