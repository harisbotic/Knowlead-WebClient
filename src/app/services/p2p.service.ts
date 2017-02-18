import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';
import { P2P_NEW } from './../utils/urls';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { P2P_ALL, P2P_DELETE, P2P_MESSAGES, P2P_MESSAGE, P2P_SCHEDULE, P2P_ACCEPT_OFFER, P2P_REMOVE_BOOKMARK, P2P_ADD_BOOKMARK } from '../utils/urls';
import { responseToResponseModel } from '../utils/converters';
import { StorageService } from './storage.service';
import { P2PMessageModel, P2PModel, ResponseModel } from '../models/dto';
import { ModelUtilsService } from './model-utils.service';
import { StorageFiller } from './storage.subject';

@Injectable()
export class P2pService {

  p2pFiller: StorageFiller<P2PModel>;
  p2pMessagesFiller: StorageFiller<P2PMessageModel[]>;

  get modelUtilsService(): ModelUtilsService {
    return this.injector.get(ModelUtilsService);
  }

  constructor(
    protected http: Http,
    protected storageService: StorageService,
    protected injector: Injector) {
    this.p2pFiller = this.modelUtilsService.fillP2p.bind(this.modelUtilsService);
    this.p2pMessagesFiller = this.modelUtilsService.fillP2pMessages.bind(this.modelUtilsService);
  }

  create(value: P2PModel): Observable<ResponseModel> {
    let tmp = _(value).omitBy(_.isNull).value();
    return this.http.post(P2P_NEW, tmp).map(responseToResponseModel);
  }

  getAll(): Observable<P2PModel[]> {
    return this.transformP2ps(this.http.get(P2P_ALL)
      .map(responseToResponseModel)
      .map(v => v.object));
  }

  private transformP2ps(all: Observable<P2PModel[]>): Observable<P2PModel[]> {
    return all.do((p2ps: P2PModel[]) => {
        p2ps.forEach(p2p => {
          this.storageService.setToStorage('p2p', this.p2pFiller, {id: p2p.p2pId}, p2p);
        });
      })
      .flatMap(v => this.modelUtilsService.fillP2ps(v));
  }

  private modifyP2p(o: Observable<P2PModel>): Observable<P2PModel> {
    return o.flatMap(p2p => this.modelUtilsService.fillP2p(p2p))
      .do((p2p: P2PModel) => this.storageService.setToStorage('p2p', this.p2pFiller, {id: p2p.p2pId}, p2p));
  }

  private modifyP2pMessage(o: Observable<P2PMessageModel>): Observable<P2PMessageModel> {
    let p2pId;
    let p2pMsgId;
    return o.do(msg => {p2pId = msg.p2pId; p2pMsgId = msg.p2pMessageId; })
      .do(msg => this.storageService.modifyStorage('p2pMessages', this.p2pMessagesFiller, {id: msg.p2pId}, (messages: P2PMessageModel[]) =>
        messages.concat([msg])
      ))
      .flatMap(message => this.storageService.getFromStorage('p2pMessages', this.p2pMessagesFiller, {id: p2pId})
        .map((messages: P2PMessageModel[]) => {
          return messages.find(msg => msg.p2pMessageId === p2pMsgId);
        }));
  }

  delete(p2p: P2PModel): Observable<P2PModel> {
    return this.modifyP2p(this.http.delete(P2P_DELETE + '/' + p2p.p2pId)
      .map(responseToResponseModel)
      .map(v => v.object));
  }

  get(id: number | P2PModel): Observable<P2PModel> {
    // id is type of string when got from url parameter (ex. /p2p/3)
    if (typeof(id) === 'number' || typeof(id) === 'string') {
      return this.storageService.getFromStorage<P2PModel>('p2p', this.p2pFiller, {id: id});
    } else {
      this.storageService.setToStorage<P2PModel>('p2p', this.p2pFiller, {id: id.p2pId}, id);
      return this.get(id.p2pId);
    }
    // return this.http.get(P2P + "/" + id).map(responseToResponseModel).map(v => v.object);
  }

  message(message: P2PMessageModel): Observable<P2PMessageModel> {
    return this.http.post(P2P_MESSAGE, message).map(responseToResponseModel).map(v => v.object).do((newMessage: P2PMessageModel) => {
      this.storageService.getFromStorage('p2pMessages', this.p2pMessagesFiller, {'id': newMessage.p2pId})
        .take(1)
        .subscribe((messages: P2PMessageModel[]) => {
          this.storageService.setToStorage('p2pMessages', this.p2pMessagesFiller, {'id': newMessage.p2pId}, messages.concat(newMessage));
        });
    });
  }

  getMessages(id: number): Observable<P2PMessageModel[]> {
    return this.storageService.getFromStorage('p2pMessages', this.p2pMessagesFiller, {'id': id});
  }

  schedule(message: P2PMessageModel): Observable<P2PModel> {
    return this.modifyP2p(this.http.post(P2P_SCHEDULE + '/' + message.p2pMessageId, {})
       .map(responseToResponseModel)
       .map(v => v.object));
  }

  acceptOffer(message: P2PMessageModel): Observable<P2PMessageModel> {
    return this.modifyP2pMessage(this.http.post(P2P_ACCEPT_OFFER + '/' + message.p2pMessageId, {})
        .map(responseToResponseModel)
        .map(v => v.object));
  }

  refreshP2P(p2pId: number) {
    this.storageService.refreshStorage('p2pMessages', this.p2pMessagesFiller, {id: p2pId});
  }

  bookmark(p2p: P2PModel): Observable<P2PModel> {
    const url = p2p.didBookmark ? P2P_REMOVE_BOOKMARK : P2P_ADD_BOOKMARK;
    const countChange = p2p.didBookmark ? -1 : 1;
    return this.http.post(url + '/' + p2p.p2pId, {})
      .do(response => this.storageService.modifyStorage<P2PModel>('p2p', this.p2pFiller, {id: p2p.p2pId}, (oldp2p) => {
        oldp2p.bookmarkCount += countChange;
        oldp2p.didBookmark = !oldp2p.didBookmark;
        return oldp2p;
      }))
      .flatMap(response => this.storageService.getFromStorage('p2p', this.p2pFiller, {id: p2p.p2pId}));
  }
}
