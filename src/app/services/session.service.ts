import { Injectable, Injector } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { LOGIN, API } from './../utils';
import { StorageService } from './storage.service';
import 'rxjs/add/operator/map';
import { ResponseModel } from './../models/dto';
import { urlFormEncode } from './../utils/index';
import { responseToLoginResponse, loginResponseToResponseModel } from './../utils/converters';
import { LoginUserModel, LoginResponse } from '../models/frontend.models';
import { parseJwt } from '../utils/index';

export enum SessionEvent {
  LOGGED_IN,
  LOGGED_OUT
}

@Injectable()
export class SessionService {

  eventStream = new BehaviorSubject<SessionEvent>(undefined);
  lastEvent: SessionEvent = undefined;
  private refreshingAccessToken: Observable<string>;
  invalidate = false;

  protected get storageService(): StorageService {
    return this.injector.get(StorageService);
  }

  protected get http(): Http {
    return this.injector.get(Http);
  }

  constructor(protected injector: Injector) {
    this.eventStream.subscribe(val => {
      if (val !== undefined) {
        this.lastEvent = val;
      }
    });
  }

  public getAccessToken(): Observable<string> {
    if (this.refreshingAccessToken) {
      console.debug('Sharing refresh token');
      return this.refreshingAccessToken;
    }
    return this.storageService.getAccessToken().flatMap(accessToken => {
      let parsed = parseJwt(accessToken);
      let now = new Date();
      let expires = new Date(parsed.exp * 1000 - 3590 * 1000);
      if (now.getTime() < expires.getTime() && !this.invalidate) {
        return Observable.of(accessToken);
      } else {
        this.invalidate = false;
        const tmp = this.http.post(LOGIN, urlFormEncode({
          'grant_type': 'refresh_token',
          'refresh_token': this.storageService.getRefreshToken(),
          'resource': API,
          'client_id': 'angular',
          'scope': 'offline_access'
        }), {
          headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'})
        }).map(responseToLoginResponse).map(response => {
          this.storageService.setAccessToken(response.access_token, response.refresh_token, true);
          return response.access_token;
        });
        this.refreshingAccessToken = tmp.share();
        return tmp.finally(() => {
          delete this.refreshingAccessToken;
          console.log('HEPEK');
        });
      }
    });
  }

  public invalidateAccessToken() {
    this.invalidate = true;
  }

  public login(cridentials: LoginUserModel): Observable<LoginResponse> {
    let subject = new Subject<LoginResponse>();
    this.http.post(LOGIN, urlFormEncode({
      'grant_type': 'password',
      'username': cridentials.email,
      'password': cridentials.password,
      'resource': API,
      'client_id': 'angular',
      'scope': 'offline_access'
    }), {
      headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'})
    }).finally(() => {
      subject.complete();
    }).subscribe((response: Response) => {
      if (this.storageService.hasAccessToken()) {
        this.logout();
      }
      let login = responseToLoginResponse(response);
      this.storageService.setAccessToken(login.access_token, login.refresh_token, true);
      this.emitLogin();
      subject.next(login);
    }, (errorResponse: any) => {
      let error: ResponseModel = errorResponse;
      if (errorResponse.error != null) {
        error = loginResponseToResponseModel(errorResponse);
      }
      subject.error(error);
    });
    return subject;
  }

  public emitLogin() {
    this.eventStream.next(SessionEvent.LOGGED_IN);
  }

  logout() {
    this.eventStream.next(SessionEvent.LOGGED_OUT);
  }

  public getLastEventSync() {
    return this.lastEvent;
  }
}
