import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { RealtimeService, CallEventType } from '../../services/realtime.service';
import { AccountService } from '../../services/account.service';
import { _CallModel, ApplicationUserModel } from '../../models/dto';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelUtilsService } from '../../services/model-utils.service';
import { CallEndReasons } from '../../models/constants';
import { NotificationService } from '../../services/notifications/notification.service';
import { Observable } from 'rxjs/Rx';

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
  useScreenShare = false;

  startTime: Date;
  duration = 0;

  Math = Math;

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
    video.srcObject = theStream;
    video.play();
  }

  refreshStreamMuting() {
    for (let track of this.myStream.getVideoTracks()) {
      track.enabled = this.useCam;
    }
    for (let track of this.myStream.getAudioTracks()) {
      track.enabled = this.useMic;
    }
    this.myVideo.nativeElement.muted = true;
  }

  toggleCamera() {
    if (this.call) {
      this.useCam = !this.useCam;
      this.refreshStreamMuting();
    }
  }

  toggleMic() {
    if (this.call) {
      this.useMic = !this.useMic;
      this.refreshStreamMuting();
    }
  }

  toggleScreenShare() {
    if (this.call) {
      this.useScreenShare = !this.useScreenShare;
      this.realtimeService.resetCall(this.call.callId);
    }
  }

  getChromeScreenShareConstraints(): Promise<any> {
    let constraintResolver = (resolve, reject) => {
      // this statement defines getUserMedia constraints
      // that will be used to capture content of screen
      const screen_constraints = {
          mandatory: {
              chromeMediaSource: DetectRTC.screen.chromeMediaSource,
              maxWidth: 1920,
              maxHeight: 1080,
              minAspectRatio: 1.77,
            chromeMediaSourceId: undefined
          },
          optional: [],
      };

      // this statement verifies chrome extension availability
      // if installed and available then it will invoke extension API
      // otherwise it will fallback to command-line based screen capturing API
      if (DetectRTC.screen.chromeMediaSource === 'desktop' && !DetectRTC.screen.sourceId) {
          DetectRTC.screen.getSourceId(function (error) {
              // if exception occurred or access denied
              if (error && error === 'PermissionDeniedError') {
                reject(error);
              } else {
                constraintResolver(resolve, reject);
              }
          });
          return;
      }

      // this statement sets gets 'sourceId" and sets "chromeMediaSourceId"
      if (DetectRTC.screen.chromeMediaSource === 'desktop') {
          screen_constraints.mandatory.chromeMediaSourceId = DetectRTC.screen.sourceId;
      }

      // it is the session that we want to be captured
      // audio must be false
      const session = {
          video: screen_constraints
      };
      resolve(session);

      // now invoking native getUserMedia API
    };

    let extensionResolver = (resolve, reject) => {
      DetectRTC.screen.isChromeExtensionAvailable(result => {
        if (result) {
          constraintResolver(resolve, reject);
        } else {
          reject('Extension not installed!');
        }
      });
    };

    let ret = new Promise(extensionResolver);
    return ret;
  }

  getFirefoxScreenShareConstraints(): Promise<any> {
    console.log('REQUEST FOR FIREFOX CONSTRAINTS');
    return new Promise(resolve => {
      resolve({
        video: {
            mozMediaSource: 'window',
            mediaSource: 'window',
            maxWidth: 1920,
            maxHeight: 1080,
            minAspectRatio: 1.77
        }
      });
    });
  }

  captureUserMedia(onStreamApproved: (stream: MediaStream) => void, onStreamDenied: (reason: any) => void) {
      // the TMP variable is here to get arond a bug in typescript: https://github.com/Microsoft/TypeScript/issues/10242
      let handler = (session) => {
        let tmp = <any>(navigator.mediaDevices.getUserMedia(session).then((stream) => {
          navigator.mediaDevices.getUserMedia({audio: true}).then((audioStream) => {
            for (let track of audioStream.getAudioTracks()) {
              stream.addTrack(track);
            }
            onStreamApproved.call(this, stream);
          });
        }));
        tmp.catch(onStreamDenied.bind(this));
      };
      let promise: any;
      if (this.useScreenShare) {
        if ((!!(<any>navigator).mozGetUserMedia)) {
          // FIREFOX SCREEN SHARE
          promise = this.getFirefoxScreenShareConstraints();
        } else {
          // CHROME SCREEN SHARE
          promise = this.getChromeScreenShareConstraints();
        }
        promise.then(session => {
          handler(session);
        });
        promise.catch(onStreamDenied.bind(this));
      } else {
        handler({video: true});
      }
      // handler({audio: false, video: true});
  };

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
    this.captureUserMedia(this.onGotStream, this.onGotStreamError);
  }

  onGotStream(myStream: MediaStream) {
    this.myStream = myStream;
    this.addStreamToVideo(this.myVideo.nativeElement, this.myStream);
    this.myVideo.nativeElement.muted = true;
    this.refreshStreamMuting();
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
  }

  onGotStreamError(reason: any) {
    console.error(reason);
    this.realtimeService.stopCall(this.call.callId, CallEndReasons.startProblem);
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
    this.startTime = new Date();
    this.subscriptions.push(this.realtimeService.callErrorSubject.subscribe(err => {
      this.router.navigate(['/']);
      this.notificationService.error('There was an error with this call');
    }));
    this.subscriptions.push(this.realtimeService.connectionStateSubject.filter(val => val).subscribe(() => {
      this.subscriptions.push(this.route.params.subscribe((params) => {
        this.realtimeService.resetCall(params['id']);
        this.accountService.currentUser().subscribe((user) => {
          this.user = user;
        });
        this.subscriptions.push(this.realtimeService.callModelUpdateSubject.subscribe((call) => {
          if (call.call) {
            this.startTime = call.call.startDate;
          }
          if (call.type === CallEventType.CALL_RESET) {
            this.call = call.call;
            this.cleanup();
            this.initPeer();
          } else if (call.type === CallEventType.CALL_UPDATE) {
            this.call = call.call;
            this.setOtherSDP();
          } else if (call.type === CallEventType.CALL_END) {
            delete this.call;
            this.router.navigate(['/']);
            this.notificationService.info('Call has ended ...', call.reason);
          }
        }));
      }));
    }));
    this.notificationService.hideHeader();
    Observable.timer(1000, 1000).subscribe(() => {
      this.duration = new Date().getTime() - this.startTime.getTime();
    });
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
