import { Injectable, Inject, Injector } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { P2P_NEW } from './../utils/urls';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { P2P_ALL, P2P_DELETE, P2P, P2P_MESSAGES, P2P_MESSAGE } from '../utils/urls';
import { responseToResponseModel } from '../utils/converters';
import { StorageService } from './storage.service';
import { P2PMessageModel, P2PModel, ResponseModel } from '../models/dto';
import { ModelUtilsService } from './model-utils.service';
import { StorageFiller } from './storage.subject';

@Injectable()
export class P2pService {

  p2pFiller: StorageFiller<P2PModel>;

  get modelUtilsService():ModelUtilsService {
    return this.injector.get(ModelUtilsService);
  }

  constructor(
    protected http: Http,
    protected storageService: StorageService,
    protected injector: Injector) {
    this.p2pFiller = this.modelUtilsService.fillP2p.bind(this.modelUtilsService);
  }

  create(value: P2PModel): Observable<ResponseModel> {
    let tmp = _(value).omitBy(_.isNull).value();
    return this.http.post(P2P_NEW, tmp).map(responseToResponseModel);
  }

  getAll(): Observable<P2PModel[]> {
    return this.http.get(P2P_ALL)
      .map(responseToResponseModel)
      .map(v => v.object)
      .do((vals: P2PModel[]) => {
        vals.forEach((p2p) => {
          this.get(p2p.p2pId).subscribe();
        })
      });
  }

  delete(p2p: P2PModel): Observable<P2PModel> {
    return this.http.delete(P2P_DELETE + "/" + p2p.p2pId)
      .map(responseToResponseModel)
      .map(v => v.object)
      .flatMap(p2p => this.modelUtilsService.fillP2p(p2p))
      .do((p2p: P2PModel) => this.storageService.setToStorage("p2p", this.p2pFiller, {id: p2p.p2pId}, p2p));
  }

  get(id: number): Observable<P2PModel> {
    return this.storageService.getFromStorage<P2PModel>("p2p", this.p2pFiller, {id: id});
    //return this.http.get(P2P + "/" + id).map(responseToResponseModel).map(v => v.object);
  }

  message(message: P2PMessageModel): Observable<P2PMessageModel> {
    return this.http.post(P2P_MESSAGE, message).map(responseToResponseModel).map(v => v.object);
  }

  getMessages(id: number): Observable<P2PMessageModel[]> {
    return this.http.get(P2P_MESSAGES + "/" + id)
      .map(responseToResponseModel)
      .map(v => v.object)
      .flatMap(v => this.modelUtilsService.fillP2pMessages(v));
  }
}
