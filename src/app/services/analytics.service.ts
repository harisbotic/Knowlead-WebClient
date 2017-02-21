import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';
import { Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';
import { FEEDBACK } from '../utils/urls';
import { AccountService } from './account.service';
import { ApplicationUserModel, PlatformFeedbackModel } from '../models/dto';
import { SessionService, SessionEvent } from './session.service';
import { Observable } from 'rxjs';

type EventType = 'register' | 'login' | 'logout' | 'confirmEmail' | 'call' | 'p2pCall' | 'p2pCreate' | 'p2pRespond' | 'userPatch'
  | 'p2pRespond';

const categories: {[index: string]: string} = {
  'register': 'account',
  'login': 'session',
  'logout': 'session',
  'confirmEmail': 'account',
  'call': 'call',
  'p2pCall': 'call',
  'p2pCreate': 'p2p',
  'p2pRespond': 'p2p',
  'userPatch': 'account'
};

@Injectable()
export class AnalyticsService {

  user: ApplicationUserModel;
  lastLogin: string;
  initialized = false;

  protected initialize() {
    if (!this.initialized) {
      new Angulartics2GoogleAnalytics(this.analytics);
      this.initialized = true;
    }
  }

  get accountService(): AccountService {
    return this.injector.get(AccountService);
  }

  constructor(protected http: Http,
      protected analytics: Angulartics2,
      protected injector: Injector,
      protected sessionService: SessionService) {
    Observable.timer(1000).subscribe(() => {
      this.sessionService.eventStream.distinctUntilChanged().subscribe(evt => {
        if (evt === SessionEvent.LOGGED_OUT) {
          if (this.user) {
            this.sendEvent('logout');
            delete this.user;
            this.refreshUserId();
          }
          this.initialize();
        } else if (evt === SessionEvent.LOGGED_IN) {
        this.accountService.currentUser().filter(user => !!user).take(1).subscribe(user => {
            this.user = user;
            this.refreshUserId();
            this.sendEvent('login');
            this.initialize();
          });
        }
      });
    });
  }

  protected sendEvent(action: EventType, label?: any) {
    if (action === 'login') {
      if (this.lastLogin === this.user.id) {
        return;
      } else {
        this.lastLogin = this.user.id;
      }
    }
    this.analytics.eventTrack.next({action: action, properties: {category: categories[action], label: label}});
  }

  protected refreshUserId() {
    if (this.user) {
      this.analytics.setUsername.next(this.user.id);
    } else {
      this.analytics.setUsername.next(undefined);
    }
  }

  public sendFeedback(text: string) {
    let f: PlatformFeedbackModel = {
      feedback: text
    };
    return this.http.post(FEEDBACK, f);
  }

  public userRegistration(user: ApplicationUserModel) {
    this.analytics.setUsername.next(user.id);
    this.sendEvent('register');
    this.refreshUserId();
  }

  public userConfirmedEmail(user: ApplicationUserModel) {
    this.analytics.setUsername.next(user.id);
    this.sendEvent('confirmEmail');
    this.refreshUserId();
  }

}
