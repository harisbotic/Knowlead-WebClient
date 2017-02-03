import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { StorageService } from './storage.service';
import { RegisterUserModel, ResponseModel, ConfirmEmailModel, InterestModel } from './../models/dto';
import { responseToResponseModel } from './../utils/converters';
import { USER_DETAILS, REGISTER, CONFIRMEMAIL } from './../utils/urls';
import * as _ from 'lodash';
import * as fastjsonpatch from 'fast-json-patch';
import { fillArray } from './../utils/index';
import { SessionService, SessionEvent } from './session.service';
import { Guid, ApplicationUserModel } from '../models/dto';
import { ModelUtilsService } from './model-utils.service';
import { StorageFiller } from './storage.subject';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class AccountService {

  userFiller: StorageFiller<ApplicationUserModel>;

  get analyticsService(): AnalyticsService {
    return this.injector.get(AnalyticsService);
  }

  constructor(protected http: Http,
              protected storageService: StorageService,
              protected sessionService: SessionService,
              protected modelUtilsService: ModelUtilsService,
              protected injector: Injector) {
    this.userFiller = this.modelUtilsService.fillUser.bind(this.modelUtilsService);
    console.log('ACCOUTN SERVICE');
    this.sessionService.eventStream.subscribe(evt => {
      if (evt === SessionEvent.LOGGED_OUT) {
        this.storageService.clearCache(this.userFiller, 'user');
      } else {
        this.storageService.refreshStorage('user', this.userFiller);
      }
    });
  }

  public getUserById(id: Guid, includeDetails = false): Observable<ApplicationUserModel> {
    // return this.http.get(USER + '/' + id).map(responseToResponseModel).map(v => v.object);
    return this.storageService.getFromStorage<ApplicationUserModel>('otherUser', this.userFiller, {id: id, includeDetails: includeDetails});
  }

  public register(cridentials: RegisterUserModel): Observable<ResponseModel> {
    return this.http.post(REGISTER, cridentials).map(responseToResponseModel).do(response => {
      this.analyticsService.userRegistration(response.object);
    });
  }

  public confirmEmail(data: ConfirmEmailModel): Observable<ResponseModel> {
    return this.http.post(CONFIRMEMAIL, data).map(responseToResponseModel).do(response => {
      this.analyticsService.userConfirmedEmail(response.object);
    });
  }

  public currentUser(): Observable<ApplicationUserModel> {
    return this.storageService.getFromStorage<ApplicationUserModel>('user', this.userFiller).map(user => {
      return _.cloneDeep(user);
    });
  }

  public patchUser(patch: fastjsonpatch.Patch[]): Observable<ResponseModel> {
    return this.http.patch(USER_DETAILS, patch)
      .map(responseToResponseModel)
      .map(response => response.object)
      .do((user: ApplicationUserModel) => {
        if (user) {
          this.storageService.setToStorage('user', this.userFiller, null, user);
          this.storageService.setToStorage('otherUser', this.userFiller, {id: user.id, includeDetails: true}, user);
          this.storageService.setToStorage('otherUser', this.userFiller, {id: user.id, includeDetails: false}, user);
        } else {
          console.error('No object in user patch response');
        }
      });
  }

  private prepareForPatch(user: ApplicationUserModel): ApplicationUserModel {
    let cl = _.cloneDeep(user);
    (<any>cl).birthdate = (cl.birthdate) ? cl.birthdate.toUTCString() : undefined;
    const toDelete = ['country', 'state', 'motherTongue', 'status', 'interests', 'timezone', 'email', 'id', 'profilePicture', 'languages'];
    toDelete.forEach((key) => {
      delete cl[key];
    });
    for (let key of Object.keys(cl)) {
      if (cl[key] == null) {
        delete cl[key];
      }
    }
    if (cl.languages) {
      cl.languages = fillArray(cl.languages, 'coreLookupId');
    }
    cl = _.mapValues(cl, (v) => v ? v : undefined);
    return cl;
  }

  public patchUserDetails(newUser: ApplicationUserModel): Observable<ResponseModel> {
    return this.currentUser().take(1).flatMap((user) => {
      let patch;
      try {
        let _user = this.prepareForPatch(user);
        let _newUser = this.prepareForPatch(newUser);
        patch = fastjsonpatch.compare(_user, _newUser);
      } catch (e) {
        console.error('Error preparing patches: ' + e);
      }
      return this.patchUser(patch);
    });
  }

  public patchInterests(interests: InterestModel[]): Observable<ResponseModel> {
    return this.currentUser().take(1).flatMap((user) => {

      let tmp1 = <ApplicationUserModel>{};
      tmp1.interests = fillArray(_.cloneDeep(user.interests).map(i => <InterestModel>_.omit(i, 'fos')), 'fosId');
      let tmp2 = <ApplicationUserModel>{};
      tmp2.interests = fillArray(_.cloneDeep(interests).map(i => <InterestModel>_.omit(i, 'fos')), 'fosId');
      let patch = fastjsonpatch.compare(tmp1, tmp2);
      return this.patchUser(patch);
    });
  }
}
