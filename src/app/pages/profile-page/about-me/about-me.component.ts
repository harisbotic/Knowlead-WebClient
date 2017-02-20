import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { AccountService } from '../../../services/account.service';
import { ApplicationUserModel } from '../../../models/dto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent extends BaseComponent implements OnInit {

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
