import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { RealtimeService, CallEventType } from '../../services/realtime.service';
import { AccountService } from '../../services/account.service';
import { _CallModel, ApplicationUserModel } from '../../models/dto';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelUtilsService } from '../../services/model-utils.service';
import { CallEndReasons } from '../../models/constants';
import { NotificationService } from '../../services/notifications/notification.service';

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
  @ViewChild('myVideo') myVideo: ElementRef;
  JSON = JSON;
  call: _CallModel;
  user: ApplicationUserModel;
  myStream: MediaStream;
  otherStream: MediaStream;

  useMic = true;
  useCam = true;

  get initiator(): boolean {
    if (!this.call || !this.user) {
      return null;
    }
    return this.user.id === this.call.caller.peerId;
  }

  constructor(
    protected realtimeService: RealtimeService,
    protected accountService: AccountService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected notificationService: NotificationService) { super(); }

  requestStop() {
    if (this.call) {
      this.realtimeService.stopCall(this.call.callId, CallEndReasons.requested);
    }
  }

  private addStreamToVideo(video: HTMLVideoElement, theStream: MediaStream) {
    video.src = window.URL.createObjectURL(theStream);
    video.play();
  }

  toggleCamera() {
    if (this.call) {
      this.useCam = !this.useCam;
      for (let track of this.myStream.getVideoTracks()) {
        track.enabled = this.useCam;
      }
      this.myVideo.nativeElement.muted = true;
    }
  }

  toggleMic() {
    if (this.call) {
      this.useMic = !this.useMic;
      for (let track of this.myStream.getAudioTracks()) {
        track.enabled = this.useMic;
      }
      this.myVideo.nativeElement.muted = true;
    }
  }

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
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((myStream) => {
      this.myStream = myStream;
      this.addStreamToVideo(this.myVideo.nativeElement, this.myStream);
      this.myVideo.nativeElement.muted = true;
      this.peer = new SimplePeer({initiator: this.initiator, stream: myStream, trickle: true});
      console.debug('Peer initialized');
      this.peer.on('signal', (data) => {
        console.log('Got signal !');
        this.mySDP = data;
        this.realtimeService.addCallSDP(this.call.callId, data);
      });
      this.peer.on('stream', (otherStream) => {
        this.otherStream = otherStream;
        this.addStreamToVideo(this.video.nativeElement, otherStream);
      });
      this.setOtherSDP();
    }, (error) => {
      this.realtimeService.stopCall(this.call.callId, CallEndReasons.startProblem);
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
    this.subscriptions.push(this.realtimeService.callErrorSubject.subscribe(err => {
      this.router.navigate(['/']);
      this.notificationService.error('There was an error with this call');
    }));
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
          if (call.type === CallEventType.CALL_RESET) {
            this.call = call.call;
            this.cleanup();
            this.initPeer();
          } else if (call.type === CallEventType.CALL_UPDATE) {
            this.call = call.call;
            this.setOtherSDP();
          } else if (call.type === CallEventType.CALL_END) {
            // if (ModelUtilsService.isCallP2p(this.call)) {
            //   this.router.navigate(['/p2p/', this.call.p2pId]);
            // } else {
              delete this.call;
              this.router.navigate(['/']);
            // }
            this.notificationService.info('Call has ended ...', call.reason);
          }
        }));
      }));
    }));
    this.notificationService.hideHeader();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.cleanup();
    if (this.call) {
      this.realtimeService.disconnectFromCall(this.call.callId);
    }
    this.notificationService.showHeader();
  }

}
