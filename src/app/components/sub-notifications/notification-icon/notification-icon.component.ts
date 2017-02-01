import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NotificationSource } from '../../../services/notifications/notification.source';
import { NotificationModel } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-notification-icon',
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.scss']
})
export class NotificationIconComponent extends BaseComponent implements OnInit, AfterViewInit {

  notifications: NotificationModel[];
  @Input() notificationSource: NotificationSource;
  @Input() src: string;
  @Input() alt: string;
  @ViewChild('popover') popover;

  isOpened = false;

  constructor() { super(); }

  toggle() {
    //console.log(this.popover.popover);
    //this.isOpened = !this.isOpened;
    if (this.popover.popover) {
      this.popover.popover.element.nativeElement.style.width = '400px';
    }
    this.isOpened = true;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.popover.element.nativeElement.style += 'width: 400px';
  }

}
