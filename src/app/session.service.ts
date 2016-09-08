import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, Response } from "@angular/http";
import { LoginModel, LoginResponse, ActionResponse, RegisterModel } from "./models";
import { Observable } from "rxjs/observable";
import { Subscriber } from "rxjs/subscriber"
import { mapToLoginResponse, mapToActionResponse, urlFormEncode } from "./utils";
import { LOGIN, REGISTER, API } from "./utils";
import "rxjs/add/operator/map";

@Injectable()
export class SessionService {

  constructor(protected http: Http) { }

  public login(cridentials: LoginModel): Observable<LoginResponse> {
    return Observable.create((subscriber:Subscriber<LoginResponse>) => {
      this.http.post(LOGIN, urlFormEncode({
        "grant_type": "password",
        "username": cridentials.email,
        "password": cridentials.password,
        "resource": API,
        "client_id": "angular"
      }),{
        headers: new Headers({"Content-Type":"application/x-www-form-urlencoded"})
      }).subscribe((response: Response) => {
        subscriber.next(mapToLoginResponse(response));
        subscriber.complete();
      }, (errorResponse: Response) => {
        subscriber.next(mapToLoginResponse(errorResponse));
        subscriber.complete();
      })
    });
  }

  public register(cridentials: RegisterModel): Observable<ActionResponse> {
    return this.http.post(REGISTER, cridentials).map(mapToActionResponse);
  }
}
