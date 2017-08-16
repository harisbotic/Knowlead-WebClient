import { Component, OnInit } from '@angular/core';
import { ApplicationUserModel } from '../../../models/dto';
import { AccountService } from '../../../services/account.service';
import { BaseComponent } from '../../../base.component';
import { ApplicationUserModelExtended } from '../../../models/frontend.models';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss']
})
export class RankComponent extends BaseComponent implements OnInit {

  users: ApplicationUserModelExtended[] = [];
  showEmpty: boolean;
  constructor(protected accountService: AccountService) { super(); }

  ngOnInit() {
    for (let index = 0; index < 15; index++) {
      this.users.push({
      id : 'fake-id',
      email : 'fakemail@gmail.com',
      name : 'Gene',
      surname: 'Glob',
      minutesBalance: 500,
      pointsBalance: 1200,
      birthdate: undefined,
      isMale: true,
      timezone: undefined,
      aboutMe: undefined,
      averageRating: 5432,
      profilePictureId: undefined,
      profilePicture: undefined,
      countryId: undefined,
      country: undefined,
      stateId: undefined,
      state: undefined,
      motherTongueId: undefined,
      motherTongue: undefined,
      languages: undefined,
      interests: undefined,
      status: undefined,
      isMe: index === 11
    });
    }
  }

  shouldShowEmpty() {
    for (let index = 0; index < this.users.length; index++) {
      if (this.users[index].isMe && index >= 10) {
        this.showEmpty = true;
      }
    }
    return this.showEmpty;
  }
}


