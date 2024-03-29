import { Injectable, Injector } from '@angular/core';
import { AccountService } from './account.service';
import { P2PMessageModel, ApplicationUserModel, _CallModel,
  PeerInfoModel, FriendshipModel, P2PCallModel, FriendshipStatus } from '../models/dto';
import { Observable } from 'rxjs/Rx';
import { P2pService } from './p2p.service';
import { StorageService } from './storage.service';
import { StorageFiller } from './storage.subject';
import { NotebookModel, NotificationModel, Guid, LanguageModel,
         ChatMessageModel, ConversationModel, P2PModel } from '../models/dto';
import { FRONTEND } from '../utils/urls';
import { getGmtDate, parseDateIfNecessary } from '../utils/index';
import { NotebookService } from './notebook.service';
import { SpecialProfilePictures } from '../models/frontend.constants';
import { P2PModelExtended, FileStatus, BlobModelExtended } from '../models/frontend.models';
import { _BlobModel, P2PStatus } from '../models/dto';
import { findIndex, isNull } from 'lodash';

@Injectable()
export class ModelUtilsService {

  public static expandP2p(p2p: P2PModel, myId: Guid): P2PModelExtended {
    let ret = <P2PModelExtended>p2p;
    ret.isMy = p2p.createdById === myId;
    ret.actualPrice = p2p.priceAgreed ? p2p.priceAgreed : p2p.initialPrice;
    ret.canDelete = ret.isMy && !ret.isDeleted;
    ret.canLeaveFeedback = ret.isMy && ret.status === P2PStatus.Finished;
    ret.canCall = ret.status === P2PStatus.Scheduled && !ret.isDeleted && ret.isMy;
    ret.canDiscuss = ret.status === P2PStatus.Active;
    if (ret.scheduledWithId) {
      // If I created this p2p, or I am watching at someone's p2p, and that
      // p2p is not scheduled with me, display it is scheduled with other user
      if (ret.isMy || (ret.scheduledWithId !== myId && !ret.isMy)) {
        ret.otherScheduledUser = ret.scheduledWith;
        ret.otherScheduledUserId = ret.scheduledWithId;
      } else {
        // Display p2p is scheduled with creator.
        ret.otherScheduledUser = ret.createdBy;
        ret.otherScheduledUserId = ret.createdById;
      }
    }
    return ret;
  }

  public static extendBlob(blob: _BlobModel, status: FileStatus): BlobModelExtended {
    let ret = <BlobModelExtended>blob;
    ret.status = status;
    return ret;
  }

  public static getOtherUserIdInP2P(p2p: P2PModel, myId: Guid): Guid {
    if (p2p.createdById === myId) {
      return p2p.scheduledWithId;
    } else {
      return p2p.createdById;
    }
  }

  public static getOtherUserInP2P(p2p: P2PModel, myId: Guid): ApplicationUserModel {
    if (p2p.createdById === myId) {
      return p2p.scheduledWith;
    } else {
      return p2p.createdBy;
    }
  }

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

  private fill<T>(value: Observable<T>,
                  modelKey: keyof T,
                  getter: (id: any) => Observable<T[keyof T]>,
                  setter: (value: T[keyof T]) => void,
                  idKey?: string): Observable<T> {
    if (!idKey) {
      idKey = modelKey + 'Id';
    }
    let alreadySet = false;
    return value.merge(value.flatMap(val => {
      if (val[idKey] == null) {
        return Observable.of(val);
      } else {
        if (val[modelKey] && !alreadySet) {
          alreadySet = true;
          setter(val[modelKey]);
        }
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

  public fillChatMessages(values: ChatMessageModel[]): Observable<ChatMessageModel[]> {
    return this.fillArray(values, this.fillChatMessage.bind(this), 'rowKey');
  }

  public fillConversations(values: ConversationModel[]): Observable<ConversationModel[]> {
    return this.fillArray(values, this.fillConversation.bind(this), 'rowKey');
  }

  public fillArray<T>(values: T[], filler: StorageFiller<T>, idKey: keyof T): Observable<T[]> {
    values = values.filter(val => val != null);
    if (!values || values.length === 0) {
      return Observable.of([]);
    }
    let arr = values.map(() => null);
    let reduced: Observable<T> = values.reduce((o: Observable<T>, msg: T) => {
      let ret = filler(msg).takeWhile(val => val != null).do(filled => {
        let idx = findIndex(values, val => val[idKey] === filled[idKey]);
        if (idx === -1) {
          throw new Error('Item was not found: ' + filled[idKey]);
        }
        arr[idx] = filled;
      });
      return o == null ? ret : o.merge(ret);
    }, null);
    return reduced
      .map(() => arr)
      .filter((arrr) => !arrr.some(isNull));
  }

  public fillCall(call: _CallModel): Observable<_CallModel> {
    parseDateIfNecessary<_CallModel>(call, 'startDate');
    parseDateIfNecessary<_CallModel>(call, 'endDate');
    parseDateIfNecessary<_CallModel>(call, 'inactiveSince');
    return Observable.of(call);
  }

  public fillP2pMessage(value: P2PMessageModel): Observable<P2PMessageModel> {
    parseDateIfNecessary<P2PMessageModel>(value, 'timestamp');
    let ret = Observable.of(value);
    ret = this.fill(ret, 'p2p', this.p2pService.get.bind(this.p2pService), this.p2pService.setP2pToStorage.bind(this.p2pService));
    ret = this.fill(ret, 'messageFrom', this.accountService.getUserById.bind(this.accountService),
                                this.accountService.setUserToStorageWithoutDetails.bind(this.accountService));
    ret = this.fill(ret, 'messageTo', this.accountService.getUserById.bind(this.accountService),
                                this.accountService.setUserToStorageWithoutDetails.bind(this.accountService));
    return ret;
  }

  public fillP2p(value: P2PModel): Observable<P2PModel> {
    parseDateIfNecessary<P2PModel>(value, 'dateCreated');
    parseDateIfNecessary<P2PModel>(value, 'dateTimeAgreed');
    parseDateIfNecessary<P2PModel>(value, 'deadline');
    let ret = Observable.of(value);
    ret = ret.flatMap(p2p => this.storageService.getLanguages().take(1)
      .map((languages: LanguageModel[]) => {
        p2p.languages = (p2p.languages) ?
          p2p.languages.map(language => languages.find(l => l.coreLookupId === language.coreLookupId)) :
          [];
        return p2p;
      }));
    ret = this.fill(ret, 'fos', this.storageService.getFosById.bind(this.storageService),
                                this.storageService.setFosToStorage.bind(this.storageService));
    ret = this.fill(ret, 'createdBy', this.accountService.getUserById.bind(this.accountService),
                                this.accountService.setUserToStorageWithoutDetails.bind(this.accountService));
    ret = this.fill(ret, 'scheduledWith', this.accountService.getUserById.bind(this.accountService),
                                this.accountService.setUserToStorageWithoutDetails.bind(this.accountService));
    return ret;
  }

  public fillNotification(value: NotificationModel): Observable<NotificationModel> {
    parseDateIfNecessary<NotificationModel>(value, 'seenAt');
    parseDateIfNecessary<NotificationModel>(value, 'scheduledAt');
    if (value.fromApplicationUserId == null) {
      value.fromApplicationUser = <any>{
        profilePictureId: SpecialProfilePictures.system
      };
    }
    let ret = Observable.of(value);
    ret = this.fill(ret, 'fromApplicationUser', this.accountService.getUserById.bind(this.accountService),
                                this.accountService.setUserToStorageWithoutDetails.bind(this.accountService));
    ret = this.fill(ret, 'p2p', this.p2pService.get.bind(this.p2pService),
                                this.p2pService.setP2pToStorage.bind(this.p2pService));
    return ret;
  }

  public fillNotebook(value: NotebookModel): Observable<NotebookModel> {
    parseDateIfNecessary<NotebookModel>(value, 'createdAt');
    let ret = Observable.of(value);
    ret = this.fill(ret, 'createdBy', this.accountService.getUserById.bind(this.accountService),
                                this.accountService.setUserToStorageWithoutDetails.bind(this.accountService));
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
        let idx = findIndex(ret, u => u.id === user.id);
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
    parseDateIfNecessary<FriendshipModel>(value, 'createdAt');
    parseDateIfNecessary<FriendshipModel>(value, 'updatedAt');
    let ret = Observable.of(value);
    ret = this.fill(ret, 'applicationUserBigger', this.accountService.getUserById.bind(this.accountService),
                                this.accountService.setUserToStorageWithoutDetails.bind(this.accountService));
    ret = this.fill(ret, 'applicationUserSmaller', this.accountService.getUserById.bind(this.accountService),
                                this.accountService.setUserToStorageWithoutDetails.bind(this.accountService));
    ret = this.fill(ret, 'lastActionBy', this.accountService.getUserById.bind(this.accountService),
                                this.accountService.setUserToStorageWithoutDetails.bind(this.accountService));
    return ret;
  }

  public fillChatMessage(value: ChatMessageModel): Observable<ChatMessageModel> {
    parseDateIfNecessary<ChatMessageModel>(value, 'timestamp');
    let ret = Observable.of(value);
    return ret;
  }

  public fillConversation(value: ConversationModel): Observable<ConversationModel> {
    parseDateIfNecessary<ConversationModel>(value, 'timestamp');
    let ret = Observable.of(value);
    return ret;
  }

}
