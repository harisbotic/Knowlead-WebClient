import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-friends-single-notification',
  templateUrl: './friends-single-notification.component.html',
  styleUrls: ['./friends-single-notification.component.scss']
})
export class FriendsSingleNotificationComponent extends BaseComponent implements OnInit {

  constructor() { super(); }

  ngOnInit() {
  }

}
