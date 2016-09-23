import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RegisterModel, ConfirmEmail, ActionResponse } from './models';
import { Observable } from 'rxjs/observable';
import { REGISTER, CONFIRMEMAIL, mapToActionResponse } from './utils';

@Injectable()
export class AccountService {

  constructor(protected http: Http) { }

  public register(cridentials: RegisterModel): Observable<ActionResponse> {
    return this.http.post(REGISTER, cridentials).map(mapToActionResponse);
  }

  public confirmEmail(data: ConfirmEmail): Observable<ActionResponse> {
    return this.http.post(CONFIRMEMAIL, data).map(mapToActionResponse);
  }
}
