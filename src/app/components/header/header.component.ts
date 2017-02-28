import { Component, OnInit } from '@angular/core';
import { ApplicationUserModel } from '../../models/dto';
import { AccountService } from '../../services/account.service';
import { BaseComponent } from '../../base.component';
import { SessionService } from '../../services/session.service';
import { RealtimeService } from '../../services/realtime.service';
import { MockNotificationsService } from '../../services/notifications/mock-notifications.service';
import { Router, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notifications/notification.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [MockNotificationsService]
})
export class HeaderComponent extends BaseComponent implements OnInit {

  user: ApplicationUserModel;
  shouldShow = true;

  constructor(protected accountService: AccountService,
      protected sessionService: SessionService,
      protected realtimeService: RealtimeService,
      protected testNotificationSource: MockNotificationsService,
      protected notificationService: NotificationService,
      protected router: Router,
      protected activatedRoute: ActivatedRoute) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => {
      this.user = user;
    }));
    this.subscriptions.push(this.notificationService.showHeaderSubject.subscribe(
      show => this.shouldShow = show
    ));
  }

  logout() {
    this.sessionService.logout();
    this.router.navigate(['/']);
  }

  pritisno() {
    this.realtimeService.send();
  }
}
