import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers } from "@angular/http";
import { LoginModel, ActionModel, ErrorModel } from "./models";
import { Observable } from "rxjs/observable";
import { mapToAction, urlFormEncode } from "./utils";
import "rxjs/add/operator/catch";
import { LOGIN, API } from "./utils";

@Injectable()
export class SessionService {

  constructor(protected http: Http) { }

  public login(cridentials: LoginModel): Observable<ActionModel> {
    return Observable.create((observer) => {
      this.http.post(LOGIN, urlFormEncode({
        "grant_type": "password",
        "username": cridentials.email,
        "password": cridentials.password,
        "resource": API,
        "client_id": "angular"
      }),{
        headers: new Headers({"Content-Type": "application/x-www-form-urlencoded"})
      }).subscribe((response) => {
        observer.onNext(ActionModel.success());
        console.log("success");
      }, (error) => {
        return observer.next(ActionModel.failString("Error logging in"));
        //return Observable.throw("hepek");
      });
    });
  }
}
