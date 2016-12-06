import { Injectable, ReflectiveInjector } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { StorageService } from './storage.service';
import { ApplicationUserModel, RegisterUserModel, ResponseModel, ConfirmEmailModel, InterestModel } from './../models/dto';
import { responseToResponseModel } from './../utils/converters';
import { USER_DETAILS, REGISTER, CONFIRMEMAIL } from './../utils/urls';
import * as jsonpatch from 'fast-json-patch';
import * as _ from 'lodash';
import * as fastjsonpatch from 'fast-json-patch';
import { fillArray } from './../utils/index';
import { SessionService, SessionEvent } from './session.service';
import { USER } from '../utils/urls';
import { Guid } from '../models/dto';

@Injectable()
export class AccountService {

  constructor(protected http: Http,
              protected storageService: StorageService,
              protected sessionService: SessionService) {
    this.sessionService.eventStream.subscribe(evt => {
      if (evt == SessionEvent.LOGGED_OUT) {
        this.storageService.clearCache("user");
      }
    })
  }

  public getUserById(id: Guid): Observable<ApplicationUserModel> {
    //return this.http.get(USER + "/" + id).map(responseToResponseModel).map(v => v.object);
    return this.storageService.getFromStorage<ApplicationUserModel>("otherUser", {id: id});
  }

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
      return _.cloneDeep(user);
    })
  }

  public patchUser(patch: fastjsonpatch.Patch[]): Observable<ResponseModel> {
    return this.http.patch(USER_DETAILS, patch)
      .map(responseToResponseModel)
      .do((response: ResponseModel) => {
        if (response.object != null)
          this.storageService.setToStorage("user", null, response.object);
        else
          console.error("No object in user patch response");
      });
  }

  private prepareForPatch(user: ApplicationUserModel): ApplicationUserModel {
    let cl = _.cloneDeep(user);
    (<any>cl).birthdate = (cl.birthdate) ? cl.birthdate.toUTCString() : undefined;
    let toDelete = ["country", "state", "motherTongue", "status", "interests", "timezone", "email", "id"];
    cl.countryId = (cl.country) ? cl.country.geoLookupId : undefined;
    cl.stateId = (cl.state != undefined) ? cl.state.geoLookupId : undefined;
    cl.motherTongueId = (cl.motherTongue) ? cl.motherTongue.coreLookupId : undefined;
    toDelete.forEach((key) => {
      delete cl[key];
    });
    cl.languages = fillArray(cl.languages, "coreLookupId");
    cl = _.mapValues(cl, (v) => v === null ? undefined : v);
    return cl;
  }

  public patchUserDetails(newUser: ApplicationUserModel): Observable<ResponseModel> {
    return this.currentUser().flatMap((user) => {
      let _user = this.prepareForPatch(user);
      let _newUser = this.prepareForPatch(newUser);
      let patch = jsonpatch.compare(_user, _newUser);
      return this.patchUser(patch);
    });
  }

  public patchInterests(interests: InterestModel[]): Observable<ResponseModel> {
    return this.currentUser().flatMap((user) => {

      let tmp1 = <ApplicationUserModel>{};
      tmp1.interests = fillArray(_.cloneDeep(user.interests).map(i => <InterestModel>_.omit(i, "fos")), "fosId");
      let tmp2 = <ApplicationUserModel>{};
      tmp2.interests = fillArray(_.cloneDeep(interests).map(i => <InterestModel>_.omit(i, "fos")), "fosId");
      let patch = fastjsonpatch.compare(tmp1, tmp2);
      return this.patchUser(patch);
    })
  }
}
