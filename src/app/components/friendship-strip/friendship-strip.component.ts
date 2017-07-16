import { Component, OnInit, Input } from '@angular/core';
import { FriendshipModel, FriendshipDTOActions, ApplicationUserModel, FriendCallModel } from '../../models/dto';
import { ModelUtilsService } from '../../services/model-utils.service';
import { ChatService } from '../../services/chat.service';
import { AccountService } from '../../services/account.service';
import { BaseComponent } from '../../base.component';
import { Observable } from '../../signalr/Observable';

interface ButtonOption {
  title: string;
  isShown: () => boolean;
  action: FriendshipDTOActions;
}

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
  options: ButtonOption[];
  availableOptions: ButtonOption[];

  constructor(protected chatService: ChatService, protected accountService: AccountService) { super(); }

  @Input() set otherId(value: string) {
    this._otherId = value;
    this.subscriptions.push(this.chatService.getFriendshipStatus(value).subscribe(friendship => {
      this.friendship = friendship;
      this.refresh();
    }));
  }

  ngOnInit() {
    this.options = [
      {
        action: FriendshipDTOActions.NewRequest,
        title: 'Send Friend Request',
        isShown: this.canAdd.bind(this)
      },
      {
        action: FriendshipDTOActions.AcceptRequest,
        title: 'Accept Request',
        isShown: this.canAccept.bind(this)
      },
      {
        action: FriendshipDTOActions.DeclineRequest,
        title: 'Decline Request',
        isShown: this.canDecline.bind(this)
      },
      {
        action: FriendshipDTOActions.CancelRequest,
        title: 'Cancel Request',
        isShown: this.canCancel.bind(this)
      },
      {
        action: FriendshipDTOActions.RemoveFriend,
        title: 'Remove Friend',
        isShown: this.canRemove.bind(this)
      },
      {
        action: FriendshipDTOActions.BlockUser,
        title: 'Block',
        isShown: this.canBlock.bind(this)
      },
      {
        action: FriendshipDTOActions.UnblockUser,
        title: 'Unblock',
        isShown: this.canUnblock.bind(this)
      }
    ];
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => {
      this.me = user;
      this.refresh();
    }));
  }

  refresh() {
    if (this.friendship !== undefined && this.me) {
      this.availableOptions = this.options.filter( (option) => {
        return option.isShown();
      });
    }
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
