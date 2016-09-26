import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, Response } from "@angular/http";
import { LoginModel, LoginResponse, User } from "./models";
import { Observable, Subscriber, Subject } from "rxjs/Rx";
import { mapToLoginResponse, mapToActionResponse, urlFormEncode, mapToUser } from "./utils";
import { LOGIN, API, ME } from "./utils";
import { StorageService } from "./storage.service";
import "rxjs/add/operator/map";

@Injectable()
export class SessionService {

  constructor(protected http: Http, protected storageService: StorageService) {
  }

  user: User;
  access_code: string;

  public login(cridentials: LoginModel): Observable<LoginResponse> {
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
      let login = mapToLoginResponse(response);
      this.storageService.setAccessToken(login.access_token);
      subject.next(login);
    }, (errorResponse: Response) => {
      subject.next(mapToLoginResponse(errorResponse));
    });
    return subject;
  }

  public getUser(): Observable<User> {
    if (this.user != null) {
      return Observable.from([this.user]);
    }
    let ret = this.http.get(ME).map(mapToUser);
    ret.subscribe((user) => {
      this.user = user;
    });
    return ret;
  }
}
