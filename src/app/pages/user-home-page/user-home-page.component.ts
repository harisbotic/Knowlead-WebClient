import { Component, OnInit } from '@angular/core';
import { ApplicationUserModel } from '../../models/dto';
import { AccountService } from '../../services/account.service';
import { ModelUtilsService } from '../../services/model-utils.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss']
})
export class UserHomePageComponent extends BaseComponent implements OnInit {

  user: ApplicationUserModel;
  fullName = ModelUtilsService.getUserFullName;

  constructor(protected accountService: AccountService) {
    super();
  }

  ngOnInit() {
    this.accountService.currentUser().subscribe(user => this.user = user);
  }

}
