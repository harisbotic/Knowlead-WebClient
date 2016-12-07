import { Component, OnInit } from '@angular/core';
import { AccountService } from './../../services/account.service';
import { ApplicationUserModel } from './../../models/dto';
import { P2PModel } from '../../models/dto';
import { P2pService } from '../../services/p2p.service';
import { ModelUtilsService } from '../../services/model-utils.service';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss'],
  providers: [AccountService, P2pService, ModelUtilsService]
})
export class UserHomePageComponent implements OnInit {

  p2ps: P2PModel[] = [];

  constructor(protected accountService: AccountService,
              protected p2pService: P2pService) { }

  ngOnInit() {
    this.p2pService.getAll().subscribe(vals => this.p2ps = vals);
  }

}
