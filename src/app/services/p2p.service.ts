import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { P2P_NEW } from './../utils/urls';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { P2P_ALL, P2P_DELETE, P2P, P2P_MESSAGES, P2P_MESSAGE } from '../utils/urls';
import { responseToResponseModel } from '../utils/converters';
import { StorageService } from './storage.service';
import { P2PMessageModel, P2PModel, ResponseModel } from '../models/dto';

@Injectable()
export class P2pService {

  constructor(protected http: Http, protected storageService: StorageService) {}

  create(value: P2PModel): Observable<ResponseModel> {
    let tmp = _(value).omitBy(_.isNull).value();
    return this.http.post(P2P_NEW, tmp).map(responseToResponseModel);
  }

  getAll(): Observable<P2PModel[]> {
    return this.http.get(P2P_ALL).map(responseToResponseModel).map(v => v.object);
  }

  delete(p2p: P2PModel): Observable<ResponseModel> {
    return this.http.delete(P2P_DELETE + "/" + p2p.p2pId).map(responseToResponseModel);
  }

  get(id: number): Observable<P2PModel> {
    return this.storageService.getFromStorage<P2PModel>("p2p", {id: id});
    //return this.http.get(P2P + "/" + id).map(responseToResponseModel).map(v => v.object);
  }

  message(message: P2PMessageModel): Observable<P2PMessageModel> {
    return this.http.post(P2P_MESSAGE, message).map(responseToResponseModel).map(v => v.object);
  }

  getMessages(id: number): Observable<P2PMessageModel[]> {
    return this.http.get(P2P_MESSAGES + "/" + id).map(responseToResponseModel).map(v => v.object);
  }
}
