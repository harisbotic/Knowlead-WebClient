import { Component, OnInit } from '@angular/core';
import { ApplicationUserModel } from '../../models/dto';
import { AccountService } from '../../services/account.service';
import { ModelUtilsService } from '../../services/model-utils.service';
import { BaseComponent } from '../../base.component';
import { SessionService } from '../../services/session.service';
import { RealtimeService } from '../../services/realtime.service';
import { MockNotificationsService } from '../../services/notifications/mock-notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [MockNotificationsService]
})
export class HeaderComponent extends BaseComponent implements OnInit {

  user: ApplicationUserModel;
  fullName = ModelUtilsService.getUserFullName;
  referral: string;

  constructor(protected accountService: AccountService,
      protected sessionService: SessionService,
      protected realtimeService: RealtimeService,
      protected testNotificationSource: MockNotificationsService,
      protected router: Router) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.referral = ModelUtilsService.getReferralLink(user);
      }
    }));
  }

  logout() {
    this.sessionService.logout();
    this.router.navigate(['/']);
  }

  pritisno() {
    this.realtimeService.send();
  }
}
