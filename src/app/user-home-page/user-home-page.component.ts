import { Component, OnInit } from '@angular/core';
import { AccountService } from './../account.service';
import { ApplicationUserModel } from './../models/dto';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss'],
  providers: [AccountService]
})
export class UserHomePageComponent implements OnInit {

  user: ApplicationUserModel = null;

  constructor(protected accountService: AccountService) { }

  ngOnInit() {
    this.accountService.currentUser().subscribe((user) => {
      this.user = user;
    });
  }

}
