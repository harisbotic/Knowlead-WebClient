import {ModelUtilsService} from './model-utils.service';
import { Injectable } from '@angular/core';
import { API } from '../utils/urls';
import { StorageService } from './storage.service';
import { _CallModel, NotificationModel, ChatMessageModel } from '../models/dto';
import { SessionService, SessionEvent } from './session.service';
import { HubConnection } from '../signalr/HubConnection';
import { Subject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AnalyticsService } from './analytics.service';
import { ChatService } from './chat.service';
import { IConnection } from '../signalr/IConnection';
import { HttpConnection } from '../signalr/HttpConnection';

export enum CallEventType {
  CALL_UPDATE,
  CALL_RESET,
  CALL_END
}

export interface CallEvent {
  type: CallEventType;
  call: _CallModel;
  reason?: string;
}

@Injectable()
export class RealtimeService {
  rpcConnection: HubConnection;
  accessToken: string;

  public callSubject = new Subject<_CallModel>();
  public callInvitations = new Subject<_CallModel>();
  public callModelUpdateSubject = new Subject<CallEvent>();
  public callErrorSubject = new Subject<any>();
  public connectionStateSubject = new BehaviorSubject<boolean>(false);
  public callMessageSubject = new Subject<ChatMessageModel>();

  public notificationSubject = new Subject<NotificationModel>();

  protected parseIfString<T>(value: T): T {
    if (typeof(value) === 'string') {
      return JSON.parse(value);
    } else {
      return value;
    }
  }

  initConnection = () => {
    console.info('Init websockets');
    const connection = new HttpConnection(API + '/mainHub?accessToken=' + this.accessToken);
    this.rpcConnection = new HubConnection(connection);
    this.rpcConnection.start().then(() => {
      if (!this.rpcConnection) {
        const tmp = Observable.timer(5000).subscribe(() => {
          this.initConnection();
          tmp.unsubscribe();
        });
        return;
      }
      this.connectionStateSubject.next(true);

      // CALL STUFF
      this.rpcConnection.on('callInvitation', (call: _CallModel) => {
        this.modelUtilsService.fillCall(this.parseIfString(call)).subscribe(filled =>
          this.callInvitations.next(filled)
        );
      });
      this.rpcConnection.on('startCall', (call: _CallModel) => {
        console.debug('STARTING CALL');
        call = this.parseIfString(call);
        this.router.navigate(['/call', call.callId]);
      });
      this.rpcConnection.on('callModelUpdate', (value: _CallModel) => {
        console.debug('NEW CALL MODEL');
        this.modelUtilsService.fillCall(this.parseIfString(value)).subscribe(call =>
          this.callModelUpdateSubject.next({type: CallEventType.CALL_UPDATE, call: call})
        );
      });
      this.rpcConnection.on('callReset', (value: _CallModel) => {
        console.debug('CALL RESET');
        value = this.parseIfString(value);
        this.modelUtilsService.fillCall(this.parseIfString(value)).subscribe(call =>
          this.callModelUpdateSubject.next({type: CallEventType.CALL_RESET, call: call})
        );
      });
      this.rpcConnection.on('stopCall', (reason: string) => {
        this.callModelUpdateSubject.next({type: CallEventType.CALL_END, call: null, reason: reason});
      });
      this.rpcConnection.on('callMsg', (message: ChatMessageModel) => {
        let chatMessage = this.parseIfString<ChatMessageModel>(message);
        chatMessage.timestamp = (typeof chatMessage.timestamp === 'string') ?
          new Date(Date.parse(chatMessage.timestamp)) :
          chatMessage.timestamp;
        this.callMessageSubject.next(chatMessage);
      });

      // NOTIFICATION STUFF
      this.rpcConnection.on('displayNotification', (value: string) => {
        let notification: NotificationModel = (typeof value === 'string') ? JSON.parse(value) : value;
        this.modelUtilsService.fillNotification(notification)
          .debounceTime(1000)
          .subscribe((newNotification) => {
            this.notificationSubject.next(notification);
          })
      });

      // CHAT STUFF
      this.rpcConnection.on('displayChatMsg', (value: ChatMessageModel) => {
        let message = this.parseIfString<ChatMessageModel>(value);
        this.modelUtilsService.fillChatMessage(message).take(1).subscribe(filled => {
          this.chatService.receiveMessage(filled);
        });
      });
    });
    this.rpcConnection.onClosed = this.connectionClosed;
  }

  connectionClosed = (e) => {
    this.connectionStateSubject.next(false);
    console.warn('Websockets connetion closed: ' + e);
  }

  // CALL COMMANDS
  respondToCall(callId: string, accepted: boolean) {
    this.invoke(this.callErrorSubject, 'CallRespond', callId, accepted);
    this.analyticsService.sendEvent('callRespond', JSON.stringify(accepted));
  }

  addCallSDP(callId: string, sdp: string) {
    if (typeof(sdp) !== 'string') {
      sdp = JSON.stringify(sdp);
    }
    this.invoke(this.callErrorSubject, 'AddSDP', callId, sdp);
  }

  resetCall(callId: string) {
    this.invoke(this.callErrorSubject, 'ResetCall', callId);
  }

  stopCall(callId: string, reason: string) {
    this.invoke(this.callErrorSubject, 'StopCall', callId, reason);
    this.analyticsService.sendEvent('callStop', reason);
  }

  disconnectFromCall(callId: string) {
    this.invoke(this.callErrorSubject, 'DisconnectFromCall', callId);
    this.analyticsService.sendEvent('callDisconnect');
  }

  getCallUpdate(callId: string): Promise<_CallModel> {
    return this.rpcConnection.invoke('GetCallModel', callId).then((value) => {
      return new Promise<_CallModel>((resolve, reject) => resolve(JSON.parse(<any>value)));
    });
  }

  sendCallMsg(message: ChatMessageModel) {
    this.analyticsService.sendEvent('callMsg');
    return Observable.fromPromise(this.invoke(this.callErrorSubject, 'CallMsg', message));
  }

  // CHAT COMMANDS
  sendChatMessage(message: ChatMessageModel) {
    this.analyticsService.sendEvent('message');
    return Observable.fromPromise(this.rpcConnection.invoke('msg', message));
  }

  private invoke(errorSubject: Subject<any>, nameOfFunction: string, ...params) {
    return this.rpcConnection.invoke(nameOfFunction, ...params).catch(err => errorSubject.next(err));
  }

  stop() {
    console.info('Stopping websockets');
    try {
      this.rpcConnection.stop();
    } catch (e) {
      console.warn('Error stopping websocket: ' + e);
    }
    delete this.rpcConnection;
  }

  constructor(protected storageService: StorageService,
              protected sessionService: SessionService,
              protected router: Router,
              protected analyticsService: AnalyticsService,
              protected modelUtilsService: ModelUtilsService,
              protected chatService: ChatService) {
    this.sessionService.eventStream.subscribe(evt => {
      if (evt === SessionEvent.LOGGED_OUT) {
        if (this.rpcConnection) {
          this.stop();
        }
      }
    });
    storageService.getAccessTokenStream().subscribe((accessToken) => {
      this.accessToken = accessToken;
      if (this.rpcConnection) {
        this.stop();
      }
      if (accessToken) {
        this.initConnection();
      }
    });
  }

  send() {
    this.rpcConnection.invoke('Send', 'Neka poruka');
  }

  call(p2pId: number) {
    this.rpcConnection.invoke('StartP2pCall', p2pId);
  }
}
