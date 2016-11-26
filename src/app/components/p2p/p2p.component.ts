import { Component, OnInit, Input } from '@angular/core';
import { P2PModel, ApplicationUserModel, ResponseModel } from '../../models/dto';
import { AccountService } from '../../services/account.service';
import { StorageService } from '../../services/storage.service';
import { P2pService } from '../../services/p2p.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-p2p',
  templateUrl: './p2p.component.html',
  styleUrls: ['./p2p.component.scss']
})
export class P2pComponent implements OnInit {

  _p2p: P2PModel;
  @Input() set p2p(value: P2PModel) {
    this._p2p = value;
    this.storageService.getFosById(this._p2p.fosId).subscribe((fos) => {
      this._p2p.fos = fos;
    });
  };
  get p2p(): P2PModel {
    return this._p2p;
  };

  user: ApplicationUserModel;

  constructor(protected accountService: AccountService,
              protected storageService: StorageService,
              protected p2pService: P2pService,
              protected notificationService: NotificationService) {}

  ngOnInit() {
    this.accountService.currentUser().subscribe(user => this.user = user);
  }

  deleted() {
    this.p2pService.delete(this.p2p).subscribe((response) => {
      console.log(response);
      this._p2p = response.object;
    }, (error: ResponseModel) => {
      this.notificationService.error("p2p|delete fail", error.errors[0]);
    });
  }

  deletable(): boolean {
    if (this.p2p.isDeleted)
      return false;
    return (this.user) ? this.user.id == this.p2p.createdById : false; 
  }

}
