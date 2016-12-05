import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { P2PMessageModel } from '../models/dto';
import { Observable } from 'rxjs/Rx';
import { P2pService } from './p2p.service';

@Injectable()
export class ModelUtilsService {

  constructor(protected accountService: AccountService, protected p2pService: P2pService) {

  }

  public fillP2pMessages(values: P2PMessageModel[]): Observable<P2PMessageModel[]> {
    return Observable.from(values).flatMap(value => this.fillP2pMessage(value)).bufferCount(values.length);
  }

  public fillP2pMessage(value: P2PMessageModel): Observable<P2PMessageModel> {
    let ret = Observable.of(value);
    if (value.messageFrom == null)
      ret = ret.flatMap(val => this.accountService.getUserById(value.messageFromId).map(user => {
        console.warn("Filling message from in p2p message");
        value.messageFrom = user;
        return value;
      }));
    if (value.messageTo == null)
      ret = ret.flatMap(val => this.accountService.getUserById(value.messageToId).map(user => {
        console.warn("Filling message to in p2p message");
        value.messageTo = user;
        return value;
      }));
    if (value.p2p == null)
      ret = ret.flatMap(val => this.p2pService.get(value.p2pId).map(p2p => {
        console.warn("Filling p2p in p2p message");
        value.p2p = p2p;
        return value;
      }));
    return ret.onErrorResumeNext(Observable.of(value)).take(1);
  }

}
