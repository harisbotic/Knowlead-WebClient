import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { stopMediaStream } from '../../utils/index';

@Component({
  selector: 'app-mediatest',
  templateUrl: './mediatest.component.html',
  styleUrls: ['./mediatest.component.scss']
})
export class MediatestComponent implements OnInit {

  @ViewChild('recordedAudio') audioElement;
  @ViewChild('webcamElement') webcamElement;
  get audio(): HTMLAudioElement {
    return this.audioElement.nativeElement;
  }
  get webcam(): HTMLVideoElement {
    return this.webcamElement.nativeElement;
  }
  subscription: Subscription;
  videoStream: MediaStream;

  constructor() { }

  ngOnInit() {
  }

  startRecording() {
    if (this.subscription === undefined) {
      navigator.mediaDevices.getUserMedia({audio: true}).then(mediaStream => {
        const recordRTC = new RecordRTC(mediaStream, { recorderType: StereoAudioRecorder });
        recordRTC.startRecording();
        this.subscription = Observable.timer(5000).subscribe(() => {
          recordRTC.stopRecording((audioURL) => {
            this.audio.src = audioURL;
            this.audio.play();
            stopMediaStream(mediaStream);
            this.subscription.unsubscribe();
            delete this.subscription;
          });
        });
      });
    }
  }

  toggleWebcam() {
    if (this.videoStream) {
      stopMediaStream(this.videoStream);
      this.webcam.src = null;
      delete this.videoStream;
    } else {
      navigator.mediaDevices.getUserMedia({video: true}).then(mediaStream => {
        this.videoStream = mediaStream;
        this.webcam.src = window.URL.createObjectURL(mediaStream);
        this.webcam.play();
      });
    }
  }

}
