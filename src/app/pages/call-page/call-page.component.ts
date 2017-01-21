import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { RealtimeService, CallEventType } from '../../services/realtime.service';
import { AccountService } from '../../services/account.service';
import { _CallModel, ApplicationUserModel } from '../../models/dto';
import { ActivatedRoute } from '@angular/router';
import { ModelUtilsService } from '../../services/model-utils.service';

@Component({
  selector: 'app-call-page',
  templateUrl: './call-page.component.html',
  styleUrls: ['./call-page.component.scss']
})
export class CallPageComponent extends BaseComponent implements OnInit, OnDestroy {

  peer: SimplePeer;
  mySDP: string;

  signaledSDPs: string[];

  @ViewChild('video') video: ElementRef;
  JSON = JSON;
  call: _CallModel;
  user: ApplicationUserModel;
  myStream: MediaStream;
  otherStream: MediaStream;

  get initiator(): boolean {
    if (!this.call || !this.user) {
      return null;
    }
    return this.user.id === this.call.caller.peerId;
  }

  constructor(
    protected realtimeService: RealtimeService,
    protected accountService: AccountService,
    protected route: ActivatedRoute) { super(); }

  initPeer() {
    this.signaledSDPs = [];
    if (this.myStream) {
      console.warn('Peer already initalized');
    }
    if (!this.call || !this.user) {
      console.warn('Cannot initialize peer');
      return;
    }
    console.debug('Initializing peer');
    navigator.mediaDevices.getUserMedia({video: true, audio: false}).then((myStream) => {
      this.myStream = myStream;
      this.peer = new SimplePeer({initiator: this.initiator, stream: myStream, trickle: true});
      console.debug('Peer initialized');
      this.peer.on('signal', (data) => {
        console.log('Got signal !');
        this.mySDP = data;
        this.realtimeService.addCallSDP(this.call.callId, data);
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
      } catch (e) {
        console.warn('Error destroying peer: ' + e);
      }
      delete this.mySDP;
      delete this.peer;
    }
    if (this.myStream) {
      for (let track of this.myStream.getTracks()) {
        track.stop();
      }
      if (this.myStream.stop) {
        this.myStream.stop();
      }
    }
    delete this.myStream;
    if (this.otherStream && this.otherStream.stop) {
      this.otherStream.stop();
    }
    delete this.otherStream;
    console.debug('Cleaning up call');
  }

  setOtherSDP() {
    if (this.peer) {
      try {
        let other = ModelUtilsService.getOtherCallParties(this.call, this.user.id)[0];
        for (let sdp of other.sdps) {
          if (this.signaledSDPs.indexOf(sdp) === -1) {
            this.peer.signal(sdp);
            this.signaledSDPs.push(sdp);
            console.info('Signaling peer');
          }
        }
      } catch (e) {
        console.error('Error signaling peer: ' + e);
        this.initPeer();
      }
    }
  }

  ngOnInit() {
    this.subscriptions.push(this.realtimeService.connectionStateSubject.filter(val => val).subscribe(() => {
      this.subscriptions.push(this.route.params.subscribe((params) => {
        this.realtimeService.resetCall(params['id']);
        // this.realtimeService.getCallUpdate(params['id']).then(call => {
        //   this.call = call;
        //   this.initPeer();
        // });
        this.accountService.currentUser().subscribe((user) => {
          this.user = user;
        });
        this.subscriptions.push(this.realtimeService.callModelUpdateSubject.subscribe((call) => {
          this.call = call.call;
          if (call.type === CallEventType.CALL_RESET) {
            this.cleanup();
            this.initPeer();
          } else if (call.type === CallEventType.CALL_UPDATE) {
            this.setOtherSDP();
          }
        }));
      }));
    }));
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.cleanup();
  }

}
