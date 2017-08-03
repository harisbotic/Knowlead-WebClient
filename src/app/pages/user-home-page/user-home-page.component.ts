import { Component, OnInit } from '@angular/core';
import { ApplicationUserModel, P2PModel, P2PStatus, FOSModel } from '../../models/dto';
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
import { DropdownValueInterface } from '../../models/frontend.models';
import { Router } from '@angular/router';

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
  foses: DropdownValueInterface<number[]>[];
  fosToSearch: number[];

  otherUser = ModelUtilsService.getOtherUserInP2P;

  constructor(protected accountService: AccountService,
              protected p2pService: P2pService,
              protected storageService: StorageService,
              protected router: Router) {
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
    this.subscriptions.push(this.storageService.getFOShierarchy().subscribe(root => {
      this.foses = [];
      const getChildren = (fos: FOSModel): FOSModel[] => {
        let ret = [fos];
        if (fos.children) {
          for (let child of fos.children) {
            ret = ret.concat(getChildren(child));
          }
        }
        return ret;
      }
      const s = (fos: FOSModel) => {
        const children = getChildren(fos).map(f => f.coreLookupId);
        let name = fos.name;
        for (let parent = fos.parent; parent && parent.parent; parent = parent.parent) {
          name = parent.name + ' > ' + name;
        }
        this.foses.push({
          label: name,
          value: getChildren(fos).map(f => f.coreLookupId)
        });
        if (fos.children) {
          fos.children.forEach(s);
        }
      };
      root.children.forEach(s);
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

  searchByFoses() {
    if (this.fosToSearch) {
      this.router.navigate(['/home'], {queryParams: {fos: this.fosToSearch.join(',')}});
    }
  }

}
