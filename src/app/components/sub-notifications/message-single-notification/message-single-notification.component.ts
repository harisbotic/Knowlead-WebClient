import { Component, OnInit, Input } from '@angular/core';
import { NotificationModel } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-message-single-notification',
  templateUrl: './message-single-notification.component.html',
  styleUrls: ['./message-single-notification.component.scss']
})
export class MessageSingleNotificationComponent extends BaseComponent implements OnInit {

  @Input() notification: NotificationModel;

  constructor() { super(); }

  ngOnInit() {
  }

}
