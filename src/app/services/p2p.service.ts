import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { P2PModel, ResponseModel } from './../models/dto';
import { P2P_NEW } from './../utils/urls';
import { responseToResponseModel } from './../utils/converters';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { P2P_ALL, P2P_DELETE } from '../utils/urls';

@Injectable()
export class P2pService {

  constructor(protected http: Http) {}

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
}
