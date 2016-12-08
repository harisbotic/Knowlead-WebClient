import { Component, OnInit, Input } from '@angular/core';
import { P2PModel, ApplicationUserModel, ResponseModel } from '../../models/dto';
import { AccountService } from '../../services/account.service';
import { StorageService } from '../../services/storage.service';
import { P2pService } from '../../services/p2p.service';
import { NotificationService } from '../../services/notification.service';
import { ModelUtilsService } from '../../services/model-utils.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-p2p',
  templateUrl: './p2p.component.html',
  styleUrls: ['./p2p.component.scss'],
})
export class P2pComponent extends BaseComponent implements OnInit {

  _p2p: P2PModel;
  
  @Input() set p2pId(value: number) {
    if (value != null) {
      this.subscriptions.push(this.p2pService.get(value).subscribe((p2p) => this._p2p = p2p));
    } else {
      this._p2p = null;
    }
  };
  get p2p(): P2PModel {
    return this._p2p;
  };

  user: ApplicationUserModel;
  fullName: (user: ApplicationUserModel) => string;

  constructor(protected accountService: AccountService,
              protected storageService: StorageService,
              protected p2pService: P2pService,
              protected notificationService: NotificationService,
              protected modelUtilsService: ModelUtilsService) {
    super();
  }

  ngOnInit() {
    this.fullName = this.modelUtilsService.getUserFullName;
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => this.user = user));
  }

  deleted() {
    this.subscriptions.push(this.p2pService.delete(this.p2p).subscribe(undefined, (error: ResponseModel) => {
      this.notificationService.error("p2p|delete fail", error && error.errors ? error.errors[0] : undefined);
    }));
  }

  deletable(): boolean {
    if (this.p2p.isDeleted)
      return false;
    return (this.user) ? this.user.id == this.p2p.createdById : false; 
  }

}
