import { Component, OnInit } from '@angular/core';
import { ModelUtilsService } from '../../services/model-utils.service';
import { AccountService } from '../../services/account.service';
import { ApplicationUserModel, UserRelationshipStatus } from '../../models/dto';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent extends BaseComponent implements OnInit {

  fullName = ModelUtilsService.getUserFullName;
  target: ApplicationUserModel;
  user: ApplicationUserModel;
  status: string;

  constructor(protected accountService: AccountService,
              protected route: ActivatedRoute,
              protected chatService: ChatService) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe((user) => {
      this.user = user;
    }));
    this.subscriptions.push(this.route.params.subscribe(params => {
      this.subscriptions.push(this.accountService.getUserById(params["id"], true).subscribe(user => {
        this.target = user;
        this.subscriptions.push(this.chatService.getFriendshipStatus(this.target.id).subscribe(friendship => {
          if (friendship)
            switch (friendship.status) {
              case UserRelationshipStatus.Accepted:
                this.status = "Accepted";
                break;
              case UserRelationshipStatus.Pending:
                this.status = "Pending";
                break;
            }
          else
            this.status = "Add friend";
        }));
      }));
    }));
  }

  addFriend() {
    this.chatService.addFriendById(this.target.id).subscribe().unsubscribe();
  }

}
