import { BaseComponent } from '../../base.component';
import { OnInit } from '@angular/core';
import { ApplicationUserModel } from '../../models/dto';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute } from '@angular/router';
export class SubProfileBaseComponent extends BaseComponent implements OnInit {

  user: ApplicationUserModel;

  constructor(protected accountService: AccountService, protected activatedRoute: ActivatedRoute) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.activatedRoute.parent.params.subscribe((params) => {
      this.accountService.getUserById(params['id'], true).subscribe(user => {
        this.user = user;
      });
    }));
  }

}
