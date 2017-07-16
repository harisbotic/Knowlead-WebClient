import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../../base.component';
import { Guid, ApplicationUserModel } from '../../../../models/dto';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-single-friendship',
  templateUrl: './single-friendship.component.html',
  styleUrls: ['./single-friendship.component.scss']
})
export class SingleFriendshipComponent extends BaseComponent implements OnInit {
  user: ApplicationUserModel;
  @Input() set userId(id: Guid) {
    this.subscriptions.push(this.accountService.getUserById(id).subscribe( (user) => {
      this.user = user;
    }));
  };

  constructor(protected accountService: AccountService) { super(); }

  ngOnInit() {
  }

}
