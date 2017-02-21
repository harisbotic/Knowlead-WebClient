import { Component, OnInit } from '@angular/core';
import { ApplicationUserModel, P2PModel } from '../../models/dto';
import { AccountService } from '../../services/account.service';
import { BaseComponent } from '../../base.component';
import { ListP2PsRequest } from '../../models/constants';
import { P2pService } from '../../services/p2p.service';
import { sortByDateFunction } from '../../utils/index';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss']
})
export class UserHomePageComponent extends BaseComponent implements OnInit {

  user: ApplicationUserModel;
  filters = ListP2PsRequest;
  upcoming: P2PModel[];

  constructor(protected accountService: AccountService, protected p2pService: P2pService) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => this.user = user));
    this.subscriptions.push(this.p2pService.getFiltered(ListP2PsRequest.Scheduled).subscribe(p2ps => {
      p2ps.sort(sortByDateFunction<P2PModel>('dateTimeAgreed', true));
      this.upcoming = p2ps.filter((val, idx) => idx < 3);
    }));
  }

}
