import { Injectable } from '@angular/core';
import { API } from '../utils/urls';
import { StorageService } from './storage.service';
import { NotificationService } from './notifications/notification.service';
import { _CallModel, NotificationModel } from '../models/dto';
import { SessionService, SessionEvent } from './session.service';
import { HubConnection } from '../signalr/HubConnection';
import { Subject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { PopupNotificationModel } from '../models/frontend.models';

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

  protected parseIfString<T>(value: T): T {
    if (typeof(value) === 'string') {
      return JSON.parse(value);
    } else {
      return value;
    }
  }

  initConnection = () => {
    console.info('Init websockets');
    this.rpcConnection = new HubConnection(API + '/mainHub', 'accessToken=' + this.accessToken);
    this.rpcConnection.start().then(() => {
      if (!this.rpcConnection) {
        const tmp = Observable.timer(5000).subscribe(() => {
          this.initConnection();
          tmp.unsubscribe();
        });
        return;
      }
      this.connectionStateSubject.next(true);
      this.rpcConnection.on('notify', (value: PopupNotificationModel) => {
        this.notificationService.notify(value);
      });
      this.rpcConnection.on('callInvitation', (call: _CallModel) => {
        call = this.parseIfString(call);
        this.callInvitations.next(call);
      });
      this.rpcConnection.on('startCall', (call: _CallModel) => {
        console.debug('STARTING CALL');
        call = this.parseIfString(call);
        this.router.navigate(['/call', call.callId]);
      });
      this.rpcConnection.on('callModelUpdate', (value: _CallModel) => {
        console.debug('NEW CALL MODEL');
        value = this.parseIfString(value);
        this.callModelUpdateSubject.next({type: CallEventType.CALL_UPDATE, call: value});
      });
      this.rpcConnection.on('callReset', (value: _CallModel) => {
        console.debug('CALL RESET');
        value = this.parseIfString(value);
        this.callModelUpdateSubject.next({type: CallEventType.CALL_RESET, call: value});
      });
      this.rpcConnection.on('displayNotification', (value: string) => {
        let notification: NotificationModel = (typeof value === 'string') ? JSON.parse(value) : value;
        this.notificationService.receiveNotification(notification);
      });
      this.rpcConnection.on('stopCall', (reason: string) => {
        this.callModelUpdateSubject.next({type: CallEventType.CALL_END, call: null, reason: reason});
      });
    });
    this.rpcConnection.connectionClosed = this.connectionClosed;
  }

  connectionClosed = (e) => {
    this.connectionStateSubject.next(false);
    console.warn('Websockets connetion closed: ' + e);
  }

  respondToCall(callId: string, accepted: boolean) {
    this.invoke(this.callErrorSubject, 'CallRespond', callId, accepted);
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
  }

  getCallUpdate(callId: string): Promise<_CallModel> {
    return this.rpcConnection.invoke('GetCallModel', callId).then((value) => {
      return new Promise<_CallModel>((resolve, reject) => resolve(JSON.parse(<any>value)));
    });
  }

  private invoke(errorSubject: Subject<any>, nameOfFunction: string, ...params) {
    this.rpcConnection.invoke(nameOfFunction, ...params).catch(err => errorSubject.next(err));
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
              protected notificationService: NotificationService,
              protected sessionService: SessionService,
              protected router: Router) {
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
