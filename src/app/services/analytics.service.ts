import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';
import { Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';
import { FEEDBACK } from '../utils/urls';
import { AccountService } from './account.service';
import { ApplicationUserModel, PlatformFeedbackModel } from '../models/dto';
import { SessionService, SessionEvent } from './session.service';
import { Observable } from 'rxjs';

export type AnalyticsEventType = 'register' | 'login' | 'logout' | 'confirmEmail' | 'p2pCreate' | 'p2pRespond' | 'userPatch'
  | 'p2pRespond' | 'p2pDelete' | 'p2pSchedule' | 'p2pBookmark' | 'changeInfo' | 'searchRequest' | 'changeProfilePicture' | 'changeNotebook'
  | 'addNotebook' | 'callStop' | 'callStart' | 'callDisconnect' | 'callRespond' | 'callMsg' | 'claimReward';

const categories: {[index: string]: string} = {
  'register': 'account',
  'confirmEmail': 'account',
  'changeInfo': 'account',
  'searchRequest': 'account',
  'changeProfilePicture': 'account',
  'login': 'session',
  'logout': 'session',
  'p2pCreate': 'p2p',
  'p2pRespond': 'p2p',
  'p2pDelete': 'p2p',
  'p2pSchedule': 'p2p',
  'p2pBookmark': 'p2p',
  'changeNotebook': 'notebook',
  'addNotebook': 'notebook',
  'callStop': 'call',
  'callStart': 'call',
  'callMsg': 'call',
  'callDisconnect': 'call',
  'callRespond': 'call',
  'claimReward': 'store'
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

  public sendEvent(action: AnalyticsEventType, label?: any, value?: any) {
    if (action === 'login') {
      if (this.lastLogin === this.user.id) {
        return;
      } else {
        this.lastLogin = this.user.id;
      }
    }
    if (!categories[action]) {
      console.warn(action + ' action doesnt have analytics category');
    }
    this.analytics.eventTrack.next({action: action, properties: {category: categories[action], label: label, value: value}});
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
