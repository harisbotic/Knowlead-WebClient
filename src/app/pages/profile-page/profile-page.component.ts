import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ApplicationUserModel, FriendshipModel, FriendshipDTOActions } from '../../models/dto';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { ChatService } from '../../services/chat.service';
import { ModelUtilsService } from '../../services/model-utils.service';
import { calculateHash } from '../../utils/index';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent extends BaseComponent implements OnInit {

  target: ApplicationUserModel;
  me: ApplicationUserModel;
  status: string;
  isMy: boolean;

  canAddFriend: boolean;
  canMessage: boolean;
  friendship: FriendshipModel;
  coverUrl: SafeStyle;

  constructor(protected accountService: AccountService,
              protected route: ActivatedRoute,
              protected chatService: ChatService,
              protected sanitizer: DomSanitizer) {
    super();
  }

  refresh() {
    if (this.me && this.target) {
      this.isMy = this.me.id === this.target.id;
      this.canAddFriend = ModelUtilsService.canAddFriendship(this.friendship, this.me.id);
      this.canMessage = ModelUtilsService.canRemoveFriendship(this.friendship);
    }
    if (this.target) {
      let num = calculateHash(this.target.id) % 37;
      this.coverUrl = this.sanitizer.bypassSecurityTrustStyle('url(/assets/images/covers/' + num + '.jpg)');
    }
  }

  addFriend() {
    this.chatService.friendshipActionById(this.target.id, FriendshipDTOActions.NewRequest);
  }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe((user) => {
      this.me = user;
      this.refresh();
    }));
    this.subscriptions.push(this.route.params.subscribe(params => {
      const id = params['id'];
      this.subscriptions.push(this.chatService.getFriendshipStatus(id).subscribe(friendship => {
        this.friendship = friendship;
        this.refresh();
      }));
      this.subscriptions.push(this.accountService.getUserById(id, true).subscribe(user => {
        this.target = user;
        this.refresh();
      }));
    }));
  }


}
