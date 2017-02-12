import { Component, OnInit, Input } from '@angular/core';
import { ThreadModel } from '../p2p-discussion/p2p-discussion.component';

@Component({
  selector: 'app-p2p-thread',
  templateUrl: './p2p-thread.component.html',
  styleUrls: ['./p2p-thread.component.scss']
})
export class P2pThreadComponent implements OnInit {

  @Input() thread: ThreadModel;

  constructor() { }

  ngOnInit() {
  }

}
