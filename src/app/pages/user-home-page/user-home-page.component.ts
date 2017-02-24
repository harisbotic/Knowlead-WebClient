import { Component, OnInit } from '@angular/core';
import { ApplicationUserModel, P2PModel, P2PStatus } from '../../models/dto';
import { AccountService } from '../../services/account.service';
import { BaseComponent } from '../../base.component';
import { ListP2PsRequest } from '../../models/constants';
import { P2pService } from '../../services/p2p.service';
import { StorageService } from '../../services/storage.service';
import { sortByDateFunction } from '../../utils/index';
import { StorageSubject } from '../../services/storage.subject';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss']
})
export class UserHomePageComponent extends BaseComponent implements OnInit {

  user: ApplicationUserModel;
  filters = ListP2PsRequest;
  upcoming: P2PModel[];

  constructor(protected accountService: AccountService, protected p2pService: P2pService, protected storageService: StorageService) {
    super();
  }

  getUpcoming(): P2PModel[] {
    if (!this.user) {
      return;
    }
    let p2ps = [];
    for (let key of Object.keys(this.storageService.cache)) {
      const storage: StorageSubject<P2PModel> = this.storageService.cache[key];
      if (storage.key === 'p2p' &&
          storage.value != null &&
          storage.value.createdById === this.user.id &&
          storage.value.status === P2PStatus.Scheduled &&
          !storage.value.isDeleted) {
        p2ps.push(storage.value);
      }
    }
    p2ps.sort(sortByDateFunction<P2PModel>('dateTimeAgreed', true));
    return p2ps.filter((val, idx) => idx < 3);
  }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => this.user = user));
    this.subscriptions.push(this.p2pService.getFiltered(ListP2PsRequest.Scheduled).subscribe());
    this.subscriptions.push(Observable.timer(0, 1000).subscribe(() => {
      this.upcoming = this.getUpcoming();
    }));
  }

}
