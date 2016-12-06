import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { P2PMessageModel, P2PModel, ApplicationUserModel, Guid } from '../models/dto';
import { Observable } from 'rxjs/Rx';
import { P2pService } from './p2p.service';
import { StorageService } from './storage.service';

@Injectable()
export class ModelUtilsService {

  private boundUserById: (id: Guid) => Observable<ApplicationUserModel>; 

  constructor(protected accountService: AccountService, protected p2pService: P2pService, protected storageService: StorageService) {
    this.boundUserById = this.accountService.getUserById.bind(this.accountService);
  }

  private fill<T>(value: Observable<T>, modelKey: string, getter: (id: any) => Observable<any>, idKey?: string): Observable<T> {
    if (!idKey)
      idKey = modelKey + "Id";
    return value.flatMap(val => {
      if (!!val[modelKey] || val[idKey] == null)
        return Observable.of(val);
      else return getter(val[idKey]).map(obj => {
        console.warn(`Filling ${modelKey} from ${idKey}`);
        val[modelKey] = obj;
        return val;
      })
        .onErrorResumeNext(Observable.of(val))
        .take(1);
    })
  }

  public fillP2pMessages(values: P2PMessageModel[]): Observable<P2PMessageModel[]> {
    return Observable.from(values).flatMap(value => this.fillP2pMessage(value)).bufferCount(values.length);
  }

  public fillP2pMessage(value: P2PMessageModel): Observable<P2PMessageModel> {
    let ret = Observable.of(value);
    ret = this.fill(ret, "p2p", this.p2pService.get.bind(this.p2pService));
    ret = this.fill(ret, "messageFrom", this.boundUserById);
    ret = this.fill(ret, "messageTo", this.boundUserById);
    return ret;
  }

  public fillP2p(value: P2PModel): Observable<P2PModel> {
    let ret = Observable.of(value);
    ret = this.fill(ret, "fos", this.storageService.getFosById.bind(this.storageService));
    ret = this.fill(ret, "createdBy", this.boundUserById);
    ret = this.fill(ret, "scheduledWith", this.boundUserById);
    return ret;
  }

}
