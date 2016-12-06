/// <reference path="../../../signalr/Common.ts" />
/// <reference path="../../../signalr/EventSource.d.ts" />
/// <reference path="../../../signalr/HttpClient.ts" />
/// <reference path="../../../signalr/ITransport.ts" />
/// <reference path="../../../signalr/LongPollingTransport.ts" />
/// <reference path="../../../signalr/ServerSentEventsTransport.ts" />
/// <reference path="../../../signalr/WebSocketTransport.ts" />
/// <reference path="../../../signalr/Connection.ts" />
/// <reference path="../../../signalr/RpcConnection.ts" />

import { Injectable } from '@angular/core';
import { API } from '../utils/urls';
import { StorageService } from './storage.service';
import { NotificationModel } from '../models/notification.model';
import { NotificationService } from './notification.service';
import { ApplicationUserModel } from '../models/dto';
import { SessionService, SessionEvent } from './session.service';

@Injectable()
export class RealtimeService {
  rpcConnection: RpcConnection;
  accessToken: string;

  initConnection = () => {
    console.info("Init websockets");
    this.rpcConnection = new RpcConnection(API + "/chat", "accessToken=" + this.accessToken);
    this.rpcConnection.start().then(() => {
      this.rpcConnection.invoke("Knowlead.WebApi.Hubs.Chat.Send", "Neka poruka");
      this.rpcConnection.on("notify", (value: NotificationModel) => {
        this.notificationService.notify(value);
      });
      this.rpcConnection.on("setUser", (value: ApplicationUserModel) => {
        this.storageService.setToStorage("user", null, value);
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
    this.rpcConnection.invoke("Knowlead.WebApi.Hubs.Chat.Send", "Neka poruka");
  }
}