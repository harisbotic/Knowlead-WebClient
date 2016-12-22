import { Component, OnInit } from '@angular/core';
import { ModelUtilsService } from '../../services/model-utils.service';
import { AccountService } from '../../services/account.service';
import { ApplicationUserModel } from '../../models/dto';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent extends BaseComponent implements OnInit {

  fullName = ModelUtilsService.getUserFullName;
  target: ApplicationUserModel;

  constructor(protected accountService: AccountService,
              protected route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe(params => {
      this.subscriptions.push(this.accountService.getUserById(params["id"], true).subscribe(user => {
        this.target = user;
      }));
    }));
  }

}
