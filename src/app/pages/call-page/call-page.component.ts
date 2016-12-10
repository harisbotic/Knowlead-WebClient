import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-page',
  templateUrl: './call-page.component.html',
  styleUrls: ['./call-page.component.scss']
})
export class CallPageComponent implements OnInit {

  peer: SimplePeer;
  initiator: boolean;
  mySDP: string;

  constructor() { }

  initPeer() {
    this.peer = new SimplePeer({initiator: true});
  }

  ngOnInit() {
  }

}
