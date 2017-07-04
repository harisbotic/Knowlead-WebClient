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
import { ModelUtilsService } from '../../services/model-utils.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss'],
  animations: [
    trigger('peerToPeerOptions', [
      state('open', style({ height: '*', padding: '*', border: '*' })),
      state('closed', style({ height: '0px', padding: '0', border: '0' })),
      transition('open <=> closed', animate('100ms ease-out'))
    ]),
    trigger('peerToPeerRotate', [
      state('open', style({ transform: 'rotate(180deg)'})),
      state('closed', style({ transform: 'rotate(0deg)'})),
      transition('open <=> closed', animate('100ms ease-out'))
    ])
  ]
})
export class UserHomePageComponent extends BaseComponent implements OnInit {

  peerToPeerOptionsState = 'open';
  createRequestState = 'closed';

  user: ApplicationUserModel;
  filters = ListP2PsRequest;
  upcoming: P2PModel[];

  otherUser = ModelUtilsService.getOtherUserInP2P;

  constructor(protected accountService: AccountService, protected p2pService: P2pService, protected storageService: StorageService) {
    super();
  }

  getUpcoming(): P2PModel[] {
    if (!this.user) {
      return;
    }
    let p2ps: P2PModel[] = [];
    for (let key of Object.keys(this.storageService.cache)) {
      const storage: StorageSubject<P2PModel> = this.storageService.cache[key];
      if (storage.key === 'p2p' &&
          storage.value != null &&
          (storage.value.createdById === this.user.id || storage.value.scheduledWithId === this.user.id) &&
          storage.value.status === P2PStatus.Scheduled &&
          !storage.value.isDeleted) {
        p2ps.push(ModelUtilsService.expandP2p(storage.value, this.user.id));
      }
    }
    p2ps.sort((a, b) => {
      try {
        const now = new Date().getTime();
        return Math.abs(a.dateTimeAgreed.getTime() - now) -
          Math.abs(b.dateTimeAgreed.getTime() - now);
      } catch (e) {
        return 0;
      }
    });
    return p2ps.filter((val, idx) => idx < 3);
  }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => this.user = user));
    this.subscriptions.push(this.p2pService.getFiltered(ListP2PsRequest.Scheduled).subscribe(() => {
      this.subscriptions.push(Observable.timer(0, 1000).subscribe(() => {
        this.upcoming = this.getUpcoming();
      }));
    }));
  }

  togglePeerToPeerOptions() {
    if (this.peerToPeerOptionsState === 'open') {
      this.peerToPeerOptionsState = 'closed';
    } else {
      this.peerToPeerOptionsState = 'open';
    }
  }

  toggleCreateRequest() {
    if (this.createRequestState === 'open') {
      this.createRequestState = 'closed';
    } else {
      this.createRequestState = 'open';
    }
  }

}
