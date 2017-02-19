import { Injectable, Injector } from '@angular/core';
import { AccountService } from './account.service';
import { P2PMessageModel, P2PModel, ApplicationUserModel, _CallModel,
  PeerInfoModel, FriendshipModel, P2PCallModel, FriendshipStatus } from '../models/dto';
import { Observable } from 'rxjs/Rx';
import { P2pService } from './p2p.service';
import { StorageService } from './storage.service';
import * as _ from 'lodash';
import { StorageFiller } from './storage.subject';
import { NotebookModel, NotificationModel, Guid, LanguageModel } from '../models/dto';
import { FRONTEND } from '../utils/urls';
import { getGmtDate } from '../utils/index';
import { NotebookService } from './notebook.service';
import { SpecialProfilePictures } from '../models/frontend.constants';

@Injectable()
export class ModelUtilsService {

  public static getOtherUserIdInP2PMessage(message: P2PMessageModel, myId: Guid): Guid {
    if (message.messageFromId === myId) {
      return message.messageToId;
    } else if (message.messageToId === myId) {
      return message.messageFromId;
    } else {
      console.warn('No my id in message');
    }
  }
  public static getOtherUserInP2PMessage(message: P2PMessageModel, myId: Guid): ApplicationUserModel {
    if (message.messageFromId === myId) {
      return message.messageTo;
    } else if (message.messageToId === myId) {
      return message.messageFrom;
    } else {
      console.warn('No my id in message');
    }
  }

  public static getImageBlobUrl(blob: Guid) {
    if (blob === SpecialProfilePictures.system) {
      return '/assets/images/icons/system-message.png';
    }
    return (blob) ?
      'https://teststorage3123.blob.core.windows.net/images/' + blob :
      undefined;
  }

  public static getReferralLink(user: ApplicationUserModel): string {
    return FRONTEND + '/register?ref=' + user.id;
  }

  public static isCallP2p(value: _CallModel): value is P2PCallModel {
    return (<P2PCallModel>value).p2pId !== null;
  }

  public static getOtherCallParties(value: _CallModel, userId: string): PeerInfoModel[] {
    return value.peers.filter((p) => p.peerId !== userId);
  }

  public static getOtherFriendId(value: FriendshipModel, myId: string) {
    return value.applicationUserBiggerId === myId ? value.applicationUserSmallerId : value.applicationUserBiggerId;
  }

  public static getOtherFriend(value: FriendshipModel, myId: string) {
    return value.applicationUserBiggerId === myId ? value.applicationUserSmaller : value.applicationUserBigger;
  }

  public static canAcceptFriendship(value: FriendshipModel, myId: string) {
    return value && value.status === FriendshipStatus.Pending && myId !== value.lastActionById;
  }

  public static canDeclineFriendship(value: FriendshipModel, myId: string) {
    return value && ModelUtilsService.canAcceptFriendship(value, myId);
  }

  public static canBlockFriendship(value: FriendshipModel) {
    return value == null || value.status !== FriendshipStatus.Blocked;
  }

  public static canUnblockFriendship(value: FriendshipModel) {
    return value && value.status === FriendshipStatus.Blocked;
  }

  public static canRemoveFriendship(value: FriendshipModel) {
    return value && value.status === FriendshipStatus.Accepted;
  }

  public static canCancelFriendship(value: FriendshipModel, myId: string) {
    return value && value.status === FriendshipStatus.Pending && myId === value.lastActionById;
  }

  public static canAddFriendship(value: FriendshipModel, myId: string) {
    return value == null || (value.status === FriendshipStatus.Declined && myId === value.lastActionById);
  }

  protected get p2pService(): P2pService {
    return this.injector.get(P2pService);
  }
  protected get accountService(): AccountService {
    return this.injector.get(AccountService);
  }
  protected get storageService(): StorageService {
    return this.injector.get(StorageService);
  }
  protected get notebookService(): NotebookService {
    return this.injector.get(NotebookService);
  }

  constructor(protected injector: Injector) {
  }

  private fill<T>(value: Observable<T>, modelKey: keyof T, getter: (id: any) => Observable<any>, idKey?: string): Observable<T> {
    if (!idKey) {
      idKey = modelKey + 'Id';
    }
    return value.merge(value.flatMap(val => {
      if (val[idKey] == null) {
        return Observable.of(val);
      } else {
        return getter(val[idKey]).map(obj => {
          val[modelKey] = obj;
          return val;
        })
        .onErrorResumeNext(Observable.of(val));
      }
    }));
  }

  public fillP2pMessages(values: P2PMessageModel[]): Observable<P2PMessageModel[]> {
    return this.fillArray(values, this.fillP2pMessage.bind(this), 'p2pMessageId');
  }

  public fillP2ps(values: P2PModel[]): Observable<P2PModel[]> {
    return this.fillArray(values, this.fillP2p.bind(this), 'p2pId');
  }

  public fillFriendships(values: FriendshipModel[]): Observable<FriendshipModel[]> {
    return this.fillArray(values, this.fillFriendship.bind(this), 'createdAt');
  }

  public fillNotebooks(values: NotebookModel[]): Observable<NotebookModel[]> {
    return this.fillArray(values, this.notebookService.getNotebook.bind(this.notebookService), 'notebookId');
  }

  public fillNotifications(values: NotificationModel[]): Observable<NotificationModel[]> {
    return this.fillArray(values, this.fillNotification.bind(this), 'notificationId');
  }

  public fillArray<T>(values: T[], filler: StorageFiller<T>, idKey: keyof T): Observable<T[]> {
    values = values.filter(val => val != null);
    if (!values || values.length === 0) {
      return Observable.of([]);
    }
    let arr = values.map(() => null);
    let reduced: Observable<T> = values.reduce((o: Observable<T>, msg: T) => {
      let ret = filler(msg).takeWhile(val => val != null).do(filled => {
        let idx = _.findIndex(values, val => val[idKey] === filled[idKey]);
        if (idx === -1) {
          throw new Error('Item was not found: ' + filled[idKey]);
        }
        arr[idx] = filled;
      });
      return o == null ? ret : o.merge(ret);
    }, null);
    return reduced
      .map(() => arr)
      .filter((arrr) => !arrr.some(_.isNull));
  }

  public fillP2pMessage(value: P2PMessageModel): Observable<P2PMessageModel> {
    if (typeof(value.timestamp) === 'string') {
      value.timestamp = new Date(Date.parse(value.timestamp));
    }
    let ret = Observable.of(value);
    ret = this.fill(ret, 'p2p', this.p2pService.get.bind(this.p2pService));
    ret = this.fill(ret, 'messageFrom', this.accountService.getUserById.bind(this.accountService));
    ret = this.fill(ret, 'messageTo', this.accountService.getUserById.bind(this.accountService));
    return ret;
  }

  public fillP2p(value: P2PModel): Observable<P2PModel> {
    let ret = Observable.of(value);
    if (typeof(value.dateCreated) === 'string') {
      value.dateCreated = new Date(Date.parse(value.dateCreated));
    }
    if (typeof(value.dateTimeAgreed) === 'string') {
      value.dateTimeAgreed = new Date(Date.parse(value.dateTimeAgreed));
    }
    if (typeof(value.deadline) === 'string') {
      value.deadline = new Date(Date.parse(value.deadline));
    }
    ret = this.fill(ret, 'fos', this.storageService.getFosById.bind(this.storageService));
    ret = this.fill(ret, 'createdBy', this.accountService.getUserById.bind(this.accountService));
    ret = this.fill(ret, 'scheduledWith', this.accountService.getUserById.bind(this.accountService));
    ret = ret.flatMap(p2p => this.storageService.getLanguages().take(1)
      .map((languages: LanguageModel[]) => {
        p2p.languages.map(language => languages.find(l => l.coreLookupId === language.coreLookupId));
        return p2p;
      }));
    return ret;
  }

  public fillNotification(value: NotificationModel): Observable<NotificationModel> {
    if (typeof(value.scheduledAt) === 'string') {
      value.scheduledAt = new Date(Date.parse(value.scheduledAt));
    }
    if (typeof(value.seenAt) === 'string') {
      value.scheduledAt = new Date(Date.parse(value.seenAt));
    }
    if (value.fromApplicationUserId == null) {
      value.fromApplicationUser = <any>{
        profilePictureId: SpecialProfilePictures.system
      };
    }
    let ret = Observable.of(value);
    ret = this.fill(ret, 'fromApplicationUser', this.accountService.getUserById.bind(this.accountService));
    ret = this.fill(ret, 'p2p', this.p2pService.get.bind(this.p2pService));
    return ret;
  }

  public fillNotebook(value: NotebookModel): Observable<NotebookModel> {
    if (value.createdAt != null && typeof(value.createdAt) === 'string') {
      value.createdAt = new Date(Date.parse(value.createdAt));
    }
    let ret = Observable.of(value);
    ret = this.fill(ret, 'createdBy', this.accountService.getUserById.bind(this.accountService));
    return ret;
  }

  public fillUser(user: ApplicationUserModel): Observable<ApplicationUserModel> {
    if (user.birthdate != null && typeof(user.birthdate) === 'string') {
      user.birthdate = getGmtDate(new Date(Date.parse(user.birthdate)));
    }
    return Observable.of(user);
  }

  public fillUsersById(userIds: string[]): Observable<ApplicationUserModel[]> {
    let ret: ApplicationUserModel[] = [];
    if (userIds.length === 0) {
      return Observable.of([]);
    }
    return Observable.from(userIds)
      .flatMap(id => this.accountService.getUserById(id).do(user => {
        let idx = _.findIndex(ret, u => u.id === user.id);
        if (idx === -1) {
          ret.push(user);
        } else {
          ret[idx] = user;
        }
      }))
      .map(() => ret)
      .filter(arr => arr.length === userIds.length);
  }

  public fillFriendship(value: FriendshipModel): Observable<FriendshipModel> {
    if (value.updatedAt != null && typeof(value.updatedAt) === 'string') {
      value.updatedAt = new Date(Date.parse(value.updatedAt));
    }
    if (value.createdAt != null && typeof(value.createdAt) === 'string') {
      value.createdAt = new Date(Date.parse(value.createdAt));
    }
    let ret = Observable.of(value);
    ret = this.fill(ret, 'applicationUserBigger', this.accountService.getUserById.bind(this.accountService));
    ret = this.fill(ret, 'applicationUserSmaller', this.accountService.getUserById.bind(this.accountService));
    ret = this.fill(ret, 'lastActionBy', this.accountService.getUserById.bind(this.accountService));
    return ret;
  }

}
