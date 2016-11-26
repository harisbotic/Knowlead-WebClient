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

@Injectable()
export class RealtimeService {
  rpcConnection: RpcConnection;
  accessToken: string;

  initConnection() {
    this.rpcConnection = new RpcConnection(API + "/chat", "accessToken=" + this.accessToken);
    this.rpcConnection.start().then(() => {
      this.rpcConnection.on("notify", (value: NotificationModel) => {
        this.notificationService.notify(value);
      });
      this.rpcConnection.invoke("Knowlead.WebApi.Hubs.Chat.Send", "Neka poruka");
    });
  }
  
  constructor(storageService: StorageService,
              protected notificationService: NotificationService) {
    storageService.getAccessToken().subscribe((accessToken) => {
      this.accessToken = accessToken;
      if (this.rpcConnection) {
        this.rpcConnection.stop();
      }
      this.initConnection();
    });
  }
}