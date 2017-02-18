import { Component, OnInit } from '@angular/core';
import { ApplicationUserModel } from '../../models/dto';
import { AccountService } from '../../services/account.service';
import { ModelUtilsService } from '../../services/model-utils.service';
import { BaseComponent } from '../../base.component';
import { SessionService } from '../../services/session.service';
import { RealtimeService } from '../../services/realtime.service';
import { MockNotificationsService } from '../../services/notifications/mock-notifications.service';
import { Router, RoutesRecognized } from '@angular/router';
import { NotificationService } from '../../services/notifications/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [MockNotificationsService]
})
export class HeaderComponent extends BaseComponent implements OnInit {

  user: ApplicationUserModel;
  referral: string;
  shouldShow: boolean;

  constructor(protected accountService: AccountService,
      protected sessionService: SessionService,
      protected realtimeService: RealtimeService,
      protected testNotificationSource: MockNotificationsService,
      protected notificationService: NotificationService,
      protected router: Router) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.referral = ModelUtilsService.getReferralLink(user);
      }
    }));
    this.subscriptions.push(this.router.events.subscribe(event => {
      if (event instanceof RoutesRecognized) {
        this.shouldShow = !event.urlAfterRedirects.startsWith('/call');
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
