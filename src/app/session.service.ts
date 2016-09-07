import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, Response } from "@angular/http";
import { LoginModel, LoginResponse, ErrorModel } from "./models";
import { Observable } from "rxjs/observable";
import { Subscriber } from "rxjs/subscriber"
import { mapToLoginResponse, urlFormEncode } from "./utils";
import { LOGIN, API } from "./utils";

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
}
