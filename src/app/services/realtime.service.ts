import { Injectable } from '@angular/core';
import { API } from '../utils/urls';
import { StorageService } from './storage.service';
import { NotificationModel } from '../models/notification.model';
import { NotificationService } from './notification.service';
import { ApplicationUserModel, CallModel } from '../models/dto';
import { SessionService, SessionEvent } from './session.service';
import { HubConnection } from '../signalr/HubConnection';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class RealtimeService {
  rpcConnection: HubConnection;
  accessToken: string;

  public callSubject = new Subject<CallModel>();

  initConnection = () => {
    console.info("Init websockets");
    this.rpcConnection = new HubConnection(API + "/mainHub", "accessToken=" + this.accessToken);
    this.rpcConnection.start().then(() => {
      this.rpcConnection.on("notify", (value: NotificationModel) => {
        this.notificationService.notify(value);
      });
      this.rpcConnection.on("receiveCall", (value: string) => {
        if (value)
          this.callSubject.next(JSON.parse(value));
      });
    });
    this.rpcConnection.connectionClosed = this.connectionClosed;
  }

  connectionClosed = (e) => {
    console.warn("Websockets connetion closed: " + e);
  }

  stop() {
    console.info("Stopping websockets");
    try {
      this.rpcConnection.stop();
    } catch(e) {
      console.warn("Error stopping websocket: " + e);
    }
    delete this.rpcConnection;
  }
  
  constructor(protected storageService: StorageService,
              protected notificationService: NotificationService,
              protected sessionService: SessionService) {
    this.sessionService.eventStream.subscribe(evt => {
      if (evt == SessionEvent.LOGGED_OUT) {
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
    this.rpcConnection.invoke("Send", "Neka poruka");
  }

  call(p2pId: number) {
    this.rpcConnection.invoke("CallP2p", p2pId);
  }


}