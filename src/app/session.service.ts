import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, Response } from "@angular/http";
import { LoginModel, LoginResponse, ActionResponse, RegisterModel, ConfirmEmail } from "./models";
import { Subject } from "rxjs/subject";
import { Observable } from "rxjs/observable";
import { Subscriber } from "rxjs/subscriber"
import { mapToLoginResponse, mapToActionResponse, urlFormEncode } from "./utils";
import { LOGIN, REGISTER, API, CONFIRMEMAIL } from "./utils";
import "rxjs/add/operator/map";

@Injectable()
export class SessionService {

  constructor(protected http: Http) { }

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
      subject.next(mapToLoginResponse(response));
    }, (errorResponse: Response) => {
      subject.next(mapToLoginResponse(errorResponse));
    });
    return subject;
  }

  public register(cridentials: RegisterModel): Observable<ActionResponse> {
    return this.http.post(REGISTER, cridentials).map(mapToActionResponse);
  }

  public confirmEmail(data: ConfirmEmail): Observable<ActionResponse> {
    return this.http.post(CONFIRMEMAIL, data).map(mapToActionResponse);
  }
}
