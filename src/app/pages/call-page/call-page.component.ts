import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { RealtimeService } from '../../services/realtime.service';
import { AccountService } from '../../services/account.service';
import { _CallModel, ApplicationUserModel } from '../../models/dto';
import { Router, ActivatedRoute } from '@angular/router';
import { ModelUtilsService } from '../../services/model-utils.service';

@Component({
  selector: 'app-call-page',
  templateUrl: './call-page.component.html',
  styleUrls: ['./call-page.component.scss']
})
export class CallPageComponent extends BaseComponent implements OnInit, OnDestroy {

  peer: SimplePeer;
  mySDP: string;
  get otherSDP(): string {
    if (!this.user || !this.call)
      return null;
    let others = ModelUtilsService.getOtherCallParties(this.call, this.user.id);
    return others[0].sDP;
  }
  @ViewChild("video") video: ElementRef;
  JSON = JSON;
  call: _CallModel;
  user: ApplicationUserModel;
  myStream: MediaStream;
  otherStream: MediaStream;

  get initiator(): boolean {
    if (!this.call || !this.user)
      return null;
    return this.user.id == this.call.callerId;
  }

  constructor(
    protected realtimeService: RealtimeService,
    protected accountService: AccountService,
    protected route: ActivatedRoute) { super(); }

  initPeer() {
    this.cleanup();
    if (!this.call || !this.user) {
      console.warn("Cannot initialize peer");
      return;
    }
    console.debug("Initializing peer");
    navigator.mediaDevices.getUserMedia({video: true, audio: false}).then((myStream) => {
      this.myStream = myStream;
      this.peer = new SimplePeer({initiator: this.initiator, stream: myStream});
      this.peer.on('signal', (data) => {
        console.log("Got signal !");
        if (data.type == "offer" || data.type == "answer") {
          this.mySDP = data;
          this.realtimeService.setCallSDP(this.call.callId, data);
        }
      });
      this.peer.on('stream', (otherStream) => {
        this.otherStream = otherStream;
        let video: HTMLVideoElement = this.video.nativeElement;
        video.src = window.URL.createObjectURL(otherStream);
        video.play();
      });
      this.setOtherSDP();
    }, (error) => {

    });
  }

  cleanup() {
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch(e) {
        console.warn("Error destroying peer: " + e);
      }
      delete this.mySDP;
      delete this.peer;
    }
    if (this.myStream && this.myStream.stop)
      this.myStream.stop();
    delete this.myStream;
    if (this.otherStream && this.otherStream.stop)
      this.otherStream.stop();
    delete this.otherStream;
    console.log("Cleaning up call");
  }

  setOtherSDP() {
    console.log("OTHER SDP " + this.otherSDP);
    if (this.peer && this.otherSDP) {
      try {
        this.peer.signal(this.otherSDP);
        console.debug("Peer signaled !");
      } catch(e) {
        console.error("Error signaling peer: " + e);
        this.initPeer();
      }
    }
  }

  ngOnInit() {
    this.subscriptions.push(this.realtimeService.connectionStateSubject.filter(val => val).subscribe(() => {
      this.subscriptions.push(this.route.params.subscribe((params) => {
        this.realtimeService.getCallUpdate(params["id"]).then(call => {
          this.call = call;
          this.initPeer();
        });
        this.accountService.currentUser().subscribe((user) => {
          this.user = user;
          this.initPeer();
        });
        this.subscriptions.push(this.realtimeService.callModelUpdateSubject.subscribe((call) => {
          this.call = call;
          this.setOtherSDP();
        }));
      }));
    }));
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.cleanup();
  }

}