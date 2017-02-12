import { Component, OnInit, Input } from '@angular/core';
import { P2PMessageModel, ApplicationUserModel, Guid } from '../../../models/dto';
import { P2pService } from '../../../services/p2p.service';
import { AccountService } from '../../../services/account.service';
import { BaseComponent } from '../../../base.component';
import { ModelUtilsService } from '../../../services/model-utils.service';

export interface ThreadModel {
  withId: Guid;
  messages: P2PMessageModel[];
  initialPrice: number;
}

@Component({
  selector: 'app-p2p-discussion',
  templateUrl: './p2p-discussion.component.html',
  styleUrls: ['./p2p-discussion.component.scss']
})
export class P2pDiscussionComponent extends BaseComponent implements OnInit {

  @Input() p2pId: number;
  @Input() createdBy: Guid;
  @Input() initialPrice: number;

  messages: P2PMessageModel[];
  user: ApplicationUserModel;
  threads: ThreadModel[];
  threadWith: Guid[];

  constructor(protected p2pService: P2pService, protected accountService: AccountService) {
    super();
  }

  private addThread(userId: Guid) {
    this.threadWith.push(userId);
    this.threads.push({
      withId: userId,
      messages: [],
      initialPrice: this.initialPrice
    });
  }

  refreshThreads() {
    this.threads = [];
    this.threadWith = [];
    for (let message of this.messages) {
      const otherId = ModelUtilsService.getOtherUserIdInP2PMessage(message, this.user.id);
      if (this.threadWith.indexOf(otherId) === -1) {
        this.addThread(otherId);
      }
      this.threads[this.threadWith.indexOf(otherId)].messages.push(message);
    }
    if (this.createdBy !== this.user.id && this.threadWith.indexOf(this.createdBy) === -1) {
      this.addThread(this.createdBy);
    }
  }

  ngOnInit() {
    if (this.p2pId === undefined || this.initialPrice === undefined || this.createdBy === undefined) {
      console.error('No "p2p id" or "initial price" or "created by" provided for p2p discussion');
      return;
    }
    this.subscriptions.push(this.accountService.currentUser().do((user: ApplicationUserModel) => {
      this.user = user;
    }).merge(this.p2pService.getMessages(this.p2pId).do(messages => this.messages = messages))
    .subscribe(() => {
      this.threads = [];
      if (!this.messages || !this.user) {
        return;
      }
      this.messages.sort((a, b) => {
        return a.timestamp.getTime() - b.timestamp.getTime();
      });
      this.refreshThreads();
    }));
  }

}
