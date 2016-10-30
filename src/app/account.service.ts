import { Injectable, ReflectiveInjector } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { StorageService } from './storage.service';
import { ApplicationUserModel, RegisterUserModel, ResponseModel, ConfirmEmailModel } from './models/dto';
import { responseToResponseModel } from './utils/converters';
import { USER_DETAILS, REGISTER, CONFIRMEMAIL } from './utils/urls';
import * as jsonpatch from 'fast-json-patch';
import * as _ from 'lodash';

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
    return this.storageService.getFromStorage<ApplicationUserModel>("user").map(user => {
      if (user.birthdate != null && typeof(user.birthdate) == "string") {
        user.birthdate = new Date(Date.parse(user.birthdate));
      }
      return user;
    })
  }

  public patchUserDetails(newUser: ApplicationUserModel): Observable<ResponseModel> {
    return this.currentUser().flatMap((user) => {
      let _newUser = _.cloneDeep(newUser);
      let _user = _.cloneDeep(user);
      let toDelete = ["country", "state", "motherTongue", "status", "interests", "timezone", "email"];
      _newUser.countryId = _newUser.country.geoLookupId;
      _newUser.stateId = (_newUser.state != undefined) ? _newUser.state.geoLookupId : undefined;
      _newUser.motherTongueId = _newUser.motherTongue.coreLookupId;
      toDelete.forEach((key) => {
        delete _user[key];
        delete _newUser[key];
      });
      let patch = jsonpatch.compare(_user, _newUser);
      return this.http.patch(USER_DETAILS, patch)
        .map(responseToResponseModel)
        .do((response: ResponseModel) => {
          this.storageService.patchToStorage("user", undefined, patch);
        });
    });
  }
}
