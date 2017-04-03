import { Component, OnInit, Input } from '@angular/core';
import { ApplicationUserModel, ResponseModel, P2PStatus } from '../../../models/dto';
import { AccountService } from '../../../services/account.service';
import { StorageService } from '../../../services/storage.service';
import { P2pService } from '../../../services/p2p.service';
import { NotificationService } from '../../../services/notifications/notification.service';
import { ModelUtilsService } from '../../../services/model-utils.service';
import { RealtimeService } from '../../../services/realtime.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../base.component';
import { P2PModelExtended } from '../../../models/frontend.models';

@Component({
  selector: 'app-p2p',
  templateUrl: './p2p.component.html',
  styleUrls: ['./p2p.component.scss']
})
export class P2pComponent extends BaseComponent implements OnInit {

  _p2p: P2PModelExtended;
  _p2pId: number;

  @Input() set p2pId(value: number) {
    if (typeof(value) === 'string') {
      value = parseInt(value, 10);
    }
    this._p2pId = value;
    if (value != null) {
      this.subscriptions.push(this.p2pService.get(value).subscribe((p2p) => {
        this._p2p = <any>p2p;
        this.refresh();
      }));
    } else {
      this._p2p = null;
    }
  };
  get p2pId(): number {
    return this._p2pId;
  }

  get p2p(): P2PModelExtended {
    return this._p2p;
  };

  user: ApplicationUserModel;
  P2PStatus = P2PStatus;
  discussionOpened: boolean;

  constructor(protected accountService: AccountService,
              protected storageService: StorageService,
              protected p2pService: P2pService,
              protected notificationService: NotificationService,
              protected modelUtilsService: ModelUtilsService,
              protected realtimeService: RealtimeService,
              protected router: Router,
              protected activatedRoute: ActivatedRoute) {
    super();
  }

  refresh() {
    if (!this.user || !this.p2p) {
      return;
    }
    this._p2p = ModelUtilsService.expandP2p(this._p2p, this.user.id);
    if (this.discussionOpened === undefined) {
      this.discussionOpened = this.p2p.isMy;
    }
  }

  toggleDiscussion() {
    if (this.discussionOpened !== undefined) {
      this.discussionOpened = !this.discussionOpened;
    }
  }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => {
      this.user = user;
      this.refresh();
    }));
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      if (params['feedback'] === 'true') {
        this.notificationService.openP2pFeedbackForm(this.p2pId);
      }
    }));
    this.subscriptions.push(this.p2pService.getMessages(this.p2pId).subscribe(messages => {
      if (messages.length > 0) {
        this.discussionOpened = true;
      }
    }));
  }

  bookmark() {
    if (this.user && this.p2p.createdById !== this.user.id) {
      this.p2pService.bookmark(this.p2p).subscribe(undefined, err => {
        this.notificationService.error('Error bookmarking', err);
      });
    }
  }

  deleted() {
    this.subscriptions.push(this.p2pService.delete(this.p2p).subscribe(undefined, (error: ResponseModel) => {
      this.notificationService.error('p2p|delete fail', error && error.errors ? error.errors[0] : undefined);
    }));
  }

  deletable(): boolean {
    if (this.p2p.isDeleted) {
      return false;
    }
    return (this.user) ? this.user.id === this.p2p.createdById : false;
  }

  leaveFeedback() {
    this.notificationService.openP2pFeedbackForm(this.p2pId);
  }

  call() {
    this.realtimeService.call(this.p2p.p2pId);
  }

}
