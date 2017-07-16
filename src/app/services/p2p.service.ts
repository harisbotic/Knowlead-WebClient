import { Injectable, Injector } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { P2P_NEW } from './../utils/urls';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { P2P_DELETE, P2P_MESSAGE, P2P_SCHEDULE, P2P_ACCEPT_OFFER, P2P_REMOVE_BOOKMARK, P2P_ADD_BOOKMARK,
    P2P_RECOMMEND } from '../utils/urls';
import { responseToResponseModel } from '../utils/converters';
import { StorageService } from './storage.service';
import { P2PMessageModel, P2PModel } from '../models/dto';
import { ModelUtilsService } from './model-utils.service';
import { StorageFiller } from './storage.subject';
import { ListP2PsRequest } from '../models/constants';
import { P2P_ALL } from '../utils/urls';
import { AnalyticsService, AnalyticsEventType } from './analytics.service';
import { RealtimeService } from './realtime.service';
import { getGmtDate, getLocalDate } from '../utils/index';

@Injectable()
export class P2pService {

  p2pFiller: StorageFiller<P2PModel>;
  p2pMessagesFiller: StorageFiller<P2PMessageModel[]>;

  get modelUtilsService(): ModelUtilsService {
    return this.injector.get(ModelUtilsService);
  }

  get analyticsService(): AnalyticsService {
    return this.injector.get(AnalyticsService);
  }

  get realtimeService(): RealtimeService {
    return this.injector.get(RealtimeService);
  }

  constructor(
    protected http: Http,
    protected storageService: StorageService,
    protected injector: Injector) {
    this.p2pFiller = this.modelUtilsService.fillP2p.bind(this.modelUtilsService);
    this.p2pMessagesFiller = this.modelUtilsService.fillP2pMessages.bind(this.modelUtilsService);

    this.realtimeService.notificationSubject.subscribe(notification => {
      if (notification.p2pMessageId != null) {
        if (notification.p2pMessage) {
          this.addP2Pmessage(notification.p2pMessage);
        } else {
          console.warn('P2P message not filled, refreshing notifications');
          this.refreshP2Pmessages(notification.p2pId);
        }
      }
      if (notification.p2pId != null && notification.p2pMessageId == null) {
        this.refreshP2P(notification.p2pId);
      }
    });
  }

  create(value: P2PModel): Observable<P2PModel> {
    let tmp = _(value).omitBy(_.isNull).value();
    return this.modifyP2p(this.http.post(P2P_NEW, tmp)
        .map(responseToResponseModel)
        .map(o => o.object)
        .do((val: P2PModel) => this.sendFosEvent(val, 'p2pCreate', val.initialPrice)));
  }

  getAll(offset: Date): Observable<P2PModel[]> {

    const query = {
      offset: 1000,
      dateTimeStart: offset ? (getLocalDate(offset)).toISOString() : undefined
    };

    let tmp = getLocalDate(offset ? offset : new Date());

    return this.transformP2ps(this.http.get(P2P_RECOMMEND, {search: query})
      .map(responseToResponseModel)
      .map(v => v.object));
  }

  getFiltered(filter: ListP2PsRequest) {
    return this.transformP2ps(this.http.get(P2P_ALL + '/' + filter)
      .map(responseToResponseModel)
      .map(v => v.object));
  }

  getByFosId(fosId: number) {
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

  private sendFosEvent(val: P2PModel, event: AnalyticsEventType, value?: number) {
    this.storageService.getFosById(val.fosId).take(1).subscribe(fos =>
      this.analyticsService.sendEvent(event, fos.code, value)
    );
  }

  delete(p2p: P2PModel): Observable<P2PModel> {
    return this.modifyP2p(this.http.delete(P2P_DELETE + '/' + p2p.p2pId)
      .map(responseToResponseModel)
      .map(v => v.object)
      .do(val => this.sendFosEvent(val, 'p2pDelete')));
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
      this.addP2Pmessage(newMessage);
      this.analyticsService.sendEvent('p2pRespond', undefined, newMessage.priceOffer);
    });
  }

  getMessages(id: number): Observable<P2PMessageModel[]> {
    return this.storageService.getFromStorage('p2pMessages', this.p2pMessagesFiller, {'id': id});
  }

  schedule(message: P2PMessageModel): Observable<P2PModel> {
    return this.modifyP2p(this.http.post(P2P_SCHEDULE + '/' + message.p2pMessageId, {})
       .map(responseToResponseModel)
       .map(v => v.object)
       .do(obj => {
         this.analyticsService.sendEvent('p2pSchedule', undefined, obj.priceAgreed);
       }));
  }

  acceptOffer(message: P2PMessageModel): Observable<P2PMessageModel> {
    return this.modifyP2pMessage(this.http.post(P2P_ACCEPT_OFFER + '/' + message.p2pMessageId, {})
        .map(responseToResponseModel)
        .map(v => v.object)
        .do(() => this.analyticsService.sendEvent('p2pRespond', undefined, message.priceOffer)));
  }

  refreshP2P(p2pId: number) {
    this.storageService.refreshStorage('p2p', this.p2pFiller, {'id': p2pId});
  }

  refreshP2Pmessages(p2pId: number) {
    this.storageService.refreshStorage('p2pMessages', this.p2pMessagesFiller, {'id': p2pId});
  }

  addP2Pmessage(newMessage: P2PMessageModel) {
    this.storageService.getFromStorage('p2pMessages', this.p2pMessagesFiller, {'id': newMessage.p2pId})
        .take(1)
        .subscribe((messages: P2PMessageModel[]) => {
          this.storageService.setToStorage('p2pMessages', this.p2pMessagesFiller, {'id': newMessage.p2pId}, messages.concat(newMessage));
        });
  }

  bookmark(p2p: P2PModel): Observable<P2PModel> {
    const url = p2p.didBookmark ? P2P_REMOVE_BOOKMARK : P2P_ADD_BOOKMARK;
    const countChange = p2p.didBookmark ? -1 : 1;
    return this.http.post(url + '/' + p2p.p2pId, {})
      .do(() => this.analyticsService.sendEvent('p2pBookmark'))
      .do(response => this.storageService.modifyStorage<P2PModel>('p2p', this.p2pFiller, {id: p2p.p2pId}, (oldp2p) => {
        oldp2p.bookmarkCount += countChange;
        oldp2p.didBookmark = !oldp2p.didBookmark;
        return oldp2p;
      }))
      .flatMap(response => this.storageService.getFromStorage('p2p', this.p2pFiller, {id: p2p.p2pId}));
  }
}
