import { Injectable, ReflectiveInjector } from '@angular/core';
import { Http } from '@angular/http';
import { LoginModel, ConfirmEmail, ActionResponse } from './models';
import { Observable } from 'rxjs/observable';
import { REGISTER, CONFIRMEMAIL, mapToActionResponse } from './utils';
import { User } from './models/user.model';
import { StorageService } from './storage.service';

@Injectable()
export class AccountService {

  constructor(protected http: Http, protected storageService: StorageService) { }

  public register(cridentials: LoginModel): Observable<ActionResponse> {
    return this.http.post(REGISTER, cridentials).map(mapToActionResponse);
  }

  public confirmEmail(data: ConfirmEmail): Observable<ActionResponse> {
    return this.http.post(CONFIRMEMAIL, data).map(mapToActionResponse);
  }

  public currentUser(): Observable<User> {
    return this.storageService.getFromStorage<User>("user");
  }
}
