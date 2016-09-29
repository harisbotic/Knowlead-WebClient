import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, Response } from "@angular/http";
import { Observable, Subscriber, Subject } from "rxjs/Rx";
import { LOGIN, API, ME } from "./utils";
import { StorageService } from "./storage.service";
import "rxjs/add/operator/map";
import { ApplicationUserModel, RegisterUserModel } from './models/dto';
import { LoginResponse } from './models/login.response';
import { urlFormEncode } from './utils/index';
import { responseToLoginResponse, responseToUser } from './utils/converters';

@Injectable()
export class SessionService {

  constructor(protected http: Http, protected storageService: StorageService) {
  }

  user: ApplicationUserModel;
  access_code: string;

  public login(cridentials: RegisterUserModel): Observable<LoginResponse> {
    let subject = new Subject<LoginResponse>();
    this.http.post(LOGIN, urlFormEncode({
      "grant_type": "password",
      "username": cridentials.email,
      "password": cridentials.password,
      "resource": API,
      "client_id": "angular"
    }),{
      headers: new Headers({"Content-Type":"application/x-www-form-urlencoded"})
    }).finally(() => {
      subject.complete();
    }).subscribe((response: Response) => {
      let login = responseToLoginResponse(response);
      this.storageService.setAccessToken(login.access_token);
      subject.next(login);
    }, (errorResponse: Response) => {
      if (errorResponse.status != 0)
        subject.next(responseToLoginResponse(errorResponse));
      else
        subject.error(errorResponse);
    });
    return subject;
  }

  public getUser(): Observable<ApplicationUserModel> {
    if (this.user != null) {
      return Observable.from([this.user]);
    }
    let ret = this.http.get(ME).map(responseToUser);
    ret.subscribe((user) => {
      this.user = user;
    });
    return ret;
  }
}
