import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { P2PModel, ResponseModel } from './../models/dto';
import { P2P_NEW } from './../utils/urls';
import { responseToResponseModel } from './../utils/converters';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class P2pService {

  constructor(protected http: Http) {}

  create(value: P2PModel): Observable<ResponseModel> {
    return this.http.post(P2P_NEW, value).map(responseToResponseModel);
  }
}
