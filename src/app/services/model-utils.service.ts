import { Injectable, Injector } from '@angular/core';
import { AccountService } from './account.service';
import { P2PMessageModel, P2PModel, ApplicationUserModel, Guid, CallModel, P2pCallModel } from '../models/dto';
import { Observable } from 'rxjs/Rx';
import { P2pService } from './p2p.service';
import { StorageService } from './storage.service';
import * as _ from 'lodash';
import { StorageFiller } from './storage.subject';

@Injectable()
export class ModelUtilsService {

  protected get p2pService(): P2pService {
    return this.injector.get(P2pService);
  }
  
  protected get accountService(): AccountService {
    return this.injector.get(AccountService);
  }

  protected get storageService(): StorageService {
    return this.injector.get(StorageService);
  }

  constructor(protected injector: Injector) {
  }

  private fill<T>(value: Observable<T>, modelKey: string, getter: (id: any) => Observable<any>, idKey?: string): Observable<T> {
    if (!idKey)
      idKey = modelKey + "Id";
    return value.merge(value.flatMap(val => {
      if (/*!!val[modelKey] || */val[idKey] == null)
        return Observable.of(val);
      else return getter(val[idKey]).map(obj => {
        val[modelKey] = obj;
        return val;
      })
        .onErrorResumeNext(Observable.of(val))
        .take(1);
    }));
  }

  public fillP2pMessages(values: P2PMessageModel[]): Observable<P2PMessageModel[]> {
    return this.fillArray(values, this.fillP2pMessage.bind(this), "p2pMessageId");
  }

  public fillP2ps(values: P2PModel[]): Observable<P2PModel[]> {
    return this.fillArray(values, this.p2pService.get.bind(this.p2pService), "p2pId");
  }

  public fillArray<T>(values: T[], filler: StorageFiller<T>, idKey: string): Observable<T[]> {
    if (!values || values.length == 0)
      return Observable.of([]);
    let arr = values.map(() => null);
    let reduced: Observable<T> = values.reduce((o, msg: T) => {
        let ret = filler(msg).do(filled => {
          //console.log(filled);
          let idx = _.findIndex(values, val => val[idKey] == filled[idKey]);
          if (idx == -1)
            throw new Error("Item was not found: " + filled[idKey]);
          arr[idx] = filled;
        });
        return o == null ? ret : o.merge(ret);
      }, null);
    return reduced
      .map(() => arr)
      .filter(arr => !arr.some(_.isNull));
  }

  public fillP2pMessage(value: P2PMessageModel): Observable<P2PMessageModel> {
    let ret = Observable.of(value);
    ret = this.fill(ret, "p2p", this.p2pService.get.bind(this.p2pService));
    ret = this.fill(ret, "messageFrom", this.accountService.getUserById.bind(this.accountService));
    ret = this.fill(ret, "messageTo", this.accountService.getUserById.bind(this.accountService));
    if (typeof(value.timestamp) == "string") {
      value.timestamp = new Date(value.timestamp);
    }
    return ret;
  }

  public fillP2p(value: P2PModel): Observable<P2PModel> {
    let ret = Observable.of(value);
    ret = this.fill(ret, "fos", this.storageService.getFosById.bind(this.storageService));
    ret = this.fill(ret, "createdBy", this.accountService.getUserById.bind(this.accountService));
    ret = this.fill(ret, "scheduledWith", this.accountService.getUserById.bind(this.accountService));
    return ret;
  }

  public fillUser(user: ApplicationUserModel): Observable<ApplicationUserModel> {
    if (user.birthdate != null && typeof(user.birthdate) == "string") {
      user.birthdate = new Date(Date.parse(user.birthdate));
    }
    return Observable.of(user);
  }

  public static getUserFullName(value: ApplicationUserModel): string {
    if (value == null) {
      return "...";
    }
    if (!!!value.name || !!!value.surname) {
      return value.email;
    }
    return value.name + " " + value.surname;
  }

  public static isCallP2p(value: CallModel | P2pCallModel) : value is P2pCallModel {
    return !!(<P2pCallModel>value).p2pId;
  }

}
