import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from './../../services/account.service';
import { ApplicationUserModel } from './../../models/dto';
import { P2PModel } from '../../models/dto';
import { P2pService } from '../../services/p2p.service';
import { ModelUtilsService } from '../../services/model-utils.service';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss'],
  providers: [P2pService]
})
export class UserHomePageComponent extends BaseComponent implements OnInit, OnDestroy {

  p2ps: P2PModel[] = [];

  constructor(protected p2pService: P2pService) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(this.p2pService.getAll().subscribe(vals => {
      this.p2ps = vals
    }));
  }

}
