import { Injectable, ReflectiveInjector } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { StorageService } from './storage.service';
import { ApplicationUserModel, RegisterUserModel, ResponseModel, ConfirmEmailModel } from './models/dto';
import { responseToResponseModel } from './utils/converters';
import { USER_DETAILS, REGISTER, CONFIRMEMAIL } from './utils/urls';

@Injectable()
export class AccountService {

  constructor(protected http: Http, protected storageService: StorageService) { }

  public register(cridentials: RegisterUserModel): Observable<ResponseModel> {
    return this.http.post(REGISTER, cridentials).map(responseToResponseModel);
  }

  public confirmEmail(data: ConfirmEmailModel): Observable<ResponseModel> {
    return this.http.post(CONFIRMEMAIL, data).map(responseToResponseModel);
  }

  public currentUser(): Observable<ApplicationUserModel> {
    return this.storageService.getFromStorage<ApplicationUserModel>("user");
  }

  public patchUser(patch: any): Observable<ResponseModel> {
    return this.http.patch(USER_DETAILS, patch)
      .map(responseToResponseModel)
      .do((response: ResponseModel) => {
        this.storageService.patchToStorage("user", patch);
      });
  }
}
