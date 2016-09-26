import { Component, OnInit } from '@angular/core';
import { User } from './../models/user.model';
import { AccountService } from './../account.service';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss'],
  providers: [AccountService]
})
export class UserHomePageComponent implements OnInit {

  user: User = null;

  constructor(protected accountService: AccountService) { }

  ngOnInit() {
    this.accountService.currentUser().subscribe((user) => {
      this.user = user;
    });
  }

}
