import { Component, OnInit, Input } from '@angular/core';
import { NotificationModel } from '../../../models/dto';

@Component({
  selector: 'app-single-notification',
  templateUrl: './single-notification.component.html',
  styleUrls: ['./single-notification.component.scss']
})
export class SingleNotificationComponent implements OnInit {

  @Input() notification: NotificationModel;

  constructor() { }

  ngOnInit() {
    console.log(this.notification.read);
  }

}
