import { Injectable, Injector } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { LOGIN, API } from './../utils';
import { StorageService } from './storage.service';
import 'rxjs/add/operator/map';
import { RegisterUserModel, ResponseModel } from './../models/dto';
import { LoginResponse } from './../models/login.response';
import { urlFormEncode } from './../utils/index';
import { responseToLoginResponse, loginResponseToResponseModel } from './../utils/converters';
import { LoginUserModel } from '../models/login-user.model';

export enum SessionEvent {
  LOGGED_IN,
  LOGGED_OUT
}

@Injectable()
export class SessionService {

  eventStream = new BehaviorSubject<SessionEvent>(undefined);
  lastEvent: SessionEvent = undefined;

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

  public login(cridentials: LoginUserModel): Observable<LoginResponse> {
    let subject = new Subject<LoginResponse>();
    this.http.post(LOGIN, urlFormEncode({
      'grant_type': 'password',
      'username': cridentials.email,
      'password': cridentials.password,
      'resource': API,
      'client_id': 'angular'
    }), {
      headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'})
    }).finally(() => {
      subject.complete();
    }).subscribe((response: Response) => {
      if (this.storageService.hasAccessToken()) {
        this.logout();
      }
      let login = responseToLoginResponse(response);
      this.storageService.setAccessToken(login.access_token);
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
