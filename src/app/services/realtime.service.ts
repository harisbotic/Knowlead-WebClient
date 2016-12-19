import { Injectable } from '@angular/core';
import { API } from '../utils/urls';
import { StorageService } from './storage.service';
import { NotificationModel } from '../models/notification.model';
import { NotificationService } from './notification.service';
import { ApplicationUserModel, _CallModel } from '../models/dto';
import { SessionService, SessionEvent } from './session.service';
import { HubConnection } from '../signalr/HubConnection';
import { Subject, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class RealtimeService {
  rpcConnection: HubConnection;
  accessToken: string;

  public callSubject = new Subject<_CallModel>();
  public callModelUpdateSubject = new Subject<_CallModel>();
  public connectionStateSubject = new BehaviorSubject<boolean>(false);

  initConnection = () => {
    console.info("Init websockets");
    this.rpcConnection = new HubConnection(API + "/mainHub", "accessToken=" + this.accessToken);
    this.rpcConnection.start("longPolling").then(() => {
      this.connectionStateSubject.next(true);
      this.rpcConnection.on("notify", (value: NotificationModel) => {
        this.notificationService.notify(value);
      });
      this.rpcConnection.on("receiveCall", (value: string) => {
        console.log("RECEIVING CALL " + JSON.parse(value));
        //if (value)
        this.callSubject.next(JSON.parse(value));
      });
      this.rpcConnection.on("callModelUpdate", (value: string) => {
        console.log("NEW CALL MODEL: ");
        console.log(JSON.parse(value));
        this.callModelUpdateSubject.next(JSON.parse(value));
      })
    });
    this.rpcConnection.connectionClosed = this.connectionClosed;
  }

  connectionClosed = (e) => {
    this.connectionStateSubject.next(false);
    console.warn("Websockets connetion closed: " + e);
  }

  respondToCall(callId: string, accepted: boolean) {
    this.rpcConnection.invoke("CallRespond", callId, accepted);
  }

  setCallSDP(callId: string, sdp: string) {
    if (typeof(sdp) !== "string")
      sdp = JSON.stringify(sdp);
    this.rpcConnection.invoke("SetSDP", callId, sdp);
  }

  getCallUpdate(callId: string): Promise<_CallModel> {
    return this.rpcConnection.invoke("GetCallModel", callId).then((value) => {
      return new Promise<_CallModel>((resolve, reject) => resolve(JSON.parse(<any>value)));
    });
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